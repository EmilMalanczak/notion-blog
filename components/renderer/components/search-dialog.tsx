import throttle from 'lodash.throttle';
import * as types from 'notion-types';
import { getBlockParentPage, getBlockTitle } from 'notion-utils';
import * as React from 'react';

import { NotionContextProvider } from '@/components/renderer/context';
import { NotionContextConsumer } from '@/components/renderer/context-root';

import { PageTitle } from './page-title';

import { ClearIcon } from '../icons/clear-icon';
import { LoadingIcon } from '../icons/loading-icon';
import { SearchIcon } from '../icons/search-icon';
import { cs } from '../utils';

// TODO: modal.default.setAppElement('.notion-viewp ort')

export class SearchDialog extends React.Component<{
    isOpen: boolean;
    rootBlockId: string;
    onClose: () => void;
    searchNotion: (params: types.SearchParams) => Promise<types.SearchResults>;
}> {
    _inputRef: any;

    _search: any;

    constructor(props: any) {
        super(props);
        this._inputRef = React.createRef();
        this.state = {
            isLoading: false,
            query: '',
            searchResult: null,
            searchError: null
        };
    }

    componentDidMount() {
        this._search = throttle(this._searchImpl.bind(this), 1000);
        this._warmupSearch();
    }

    _onAfterOpen = () => {
        if (this._inputRef.current) {
            this._inputRef.current.focus();
        }
    };

    _onChangeQuery = (e: any) => {
        const query = e.target.value;
        this.setState({ query });

        if (!query.trim()) {
            this.setState({ isLoading: false, searchResult: null, searchError: null });
        } else {
            this._search();
        }
    };

    _onClearQuery = () => {
        this._onChangeQuery({ target: { value: '' } });
    };

    _warmupSearch = async () => {
        const { searchNotion, rootBlockId } = this.props;

        // search is generally implemented as a serverless function wrapping the notion
        // private API, upon opening the search dialog, so we eagerly invoke an empty
        // search in order to warm up the serverless lambda
        await searchNotion({
            query: '',
            ancestorId: rootBlockId
        });
    };

    _searchImpl = async () => {
        const { searchNotion, rootBlockId } = this.props;
        const { query } = this.state as any;

        if (!query.trim()) {
            this.setState({ isLoading: false, searchResult: null, searchError: null });
            return;
        }

        this.setState({ isLoading: true });
        const result: any = await searchNotion({
            query,
            ancestorId: rootBlockId
        });

        console.log('search', query, result);

        let searchResult: any = null; // TODO
        let searchError: types.APIError = null as unknown as types.APIError;

        if (result.error || result.errorId) {
            searchError = result;
        } else {
            searchResult = { ...result };

            const results = searchResult.results
                .map((res: any) => {
                    const block = searchResult.recordMap.block[res.id]?.value;
                    if (!block) return null;

                    const title = getBlockTitle(block, searchResult.recordMap);
                    if (!title) {
                        return null;
                    }

                    res.title = title;
                    res.block = block;
                    res.recordMap = searchResult.recordMap;
                    res.page =
                        getBlockParentPage(block, searchResult.recordMap, {
                            inclusive: true
                        }) || block;

                    if (!res.page.id) {
                        return null;
                    }

                    if (res.highlight?.text) {
                        res.highlight.html = res.highlight.text
                            .replace(/<gzkNfoUU>/gi, '<b>')
                            .replace(/<\/gzkNfoUU>/gi, '</b>');
                    }

                    return res;
                })
                .filter(Boolean);

            // dedupe results by page id
            const searchResultsMap = results.reduce(
                (map: any, res: any) => ({
                    ...map,
                    [res.page.id]: res
                }),
                {}
            );
            searchResult.results = Object.values(searchResultsMap);
        }

        if ((this.state as any).query === query) {
            this.setState({ isLoading: false, searchResult, searchError });
        }
    };

    render() {
        const { isOpen, onClose } = this.props;
        const { isLoading, query, searchResult, searchError } = this.state as any;

        const hasQuery = !!query.trim();

        return (
            <NotionContextConsumer>
                {(ctx) => {
                    const { components, defaultPageIcon, mapPageUrl } = ctx;

                    return (
                        <components.Modal
                            isOpen={isOpen}
                            contentLabel="Search"
                            className="notion-search"
                            overlayClassName="notion-search-overlay"
                            onRequestClose={onClose}
                            onAfterOpen={this._onAfterOpen}
                        >
                            <div className="quickFindMenu">
                                <div className="searchBar">
                                    <div className="inlineIcon">
                                        {isLoading ? <LoadingIcon className="loadingIcon" /> : <SearchIcon />}
                                    </div>

                                    <input
                                        className="searchInput"
                                        placeholder="Search"
                                        value={query}
                                        ref={this._inputRef}
                                        onChange={this._onChangeQuery}
                                    />

                                    {query && (
                                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
                                        <div role="button" className="clearButton" onClick={this._onClearQuery}>
                                            <ClearIcon className="clearIcon" />
                                        </div>
                                    )}
                                </div>

                                {hasQuery &&
                                    searchResult &&
                                    (searchResult.results.length ? (
                                        <NotionContextProvider {...ctx} recordMap={searchResult.recordMap}>
                                            <div className="resultsPane">
                                                {searchResult.results.map(
                                                    (result: {
                                                        id: React.Key | null | undefined;
                                                        page: types.Block;
                                                        highlight: { html: any };
                                                    }) => (
                                                        <components.PageLink
                                                            key={result.id}
                                                            className={cs('result', 'notion-page-link')}
                                                            href={mapPageUrl(result.page.id, searchResult.recordMap)}
                                                        >
                                                            <PageTitle
                                                                block={result.page}
                                                                defaultIcon={defaultPageIcon}
                                                            />

                                                            {result.highlight?.html && (
                                                                <div
                                                                    className="notion-search-result-highlight"
                                                                    // eslint-disable-next-line react/no-danger
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: result.highlight.html
                                                                    }}
                                                                />
                                                            )}
                                                        </components.PageLink>
                                                    )
                                                )}
                                            </div>

                                            <footer className="resultsFooter">
                                                <div>
                                                    <span className="resultsCount">{searchResult.total}</span>

                                                    {searchResult.total === 1 ? ' result' : ' results'}
                                                </div>
                                            </footer>
                                        </NotionContextProvider>
                                    ) : (
                                        <div className="noResultsPane">
                                            <div className="noResults">No results</div>
                                            <div className="noResultsDetail">Try different search terms</div>
                                        </div>
                                    ))}

                                {hasQuery && !searchResult && searchError && (
                                    <div className="noResultsPane">
                                        <div className="noResults">Search error</div>
                                    </div>
                                )}
                            </div>
                        </components.Modal>
                    );
                }}
            </NotionContextConsumer>
        );
    }
}
