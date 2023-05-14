import mediumZoom from '@fisch0920/medium-zoom';
import { ExtendedRecordMap } from 'notion-types';
import * as React from 'react';

import { NotionBlockRenderer } from './block-renderer';
import { NotionContextProvider } from './context';
import { MapImageUrlFn, MapPageUrlFn, NotionComponents, SearchNotionFn } from './types';
import { getMediumZoomMargin } from './utils/get-medium-zoom-margin';

export const NotionRenderer: React.FC<{
    recordMap: ExtendedRecordMap;
    components: Partial<NotionComponents> | null;

    mapPageUrl: MapPageUrlFn | null;
    mapImageUrl: MapImageUrlFn | null;
    searchNotion: SearchNotionFn | null;
    onHideSearch: (() => void) | null;
    isShowingSearch: boolean;
    rootPageId: string | null;
    rootDomain: string | null;

    // set fullPage to false to render page content only
    // this will remove the header, cover image, and footer
    fullPage?: boolean;

    darkMode?: boolean;
    previewImages?: boolean;
    forceCustomImages?: boolean;
    showCollectionViewDropdown?: boolean;
    linkTableTitleProperties?: boolean;
    isLinkCollectionToUrlProperty?: boolean;
    isImageZoomable?: boolean;

    showTableOfContents?: boolean;
    minTableOfContentsItems?: number;

    defaultPageIcon: string | null;
    defaultPageCover: string | null;
    defaultPageCoverPosition: number | null;

    className?: string;
    bodyClassName?: string;

    header?: React.ReactNode;
    footer?: React.ReactNode;
    pageHeader?: React.ReactNode;
    pageFooter?: React.ReactNode;
    pageTitle?: React.ReactNode;
    pageAside?: React.ReactNode;
    pageCover?: React.ReactNode;

    blockId?: string;
    hideBlockId?: boolean;
    disableHeader?: boolean;
}> = ({
    components,
    recordMap,
    mapPageUrl,
    mapImageUrl,
    searchNotion,
    isShowingSearch,
    onHideSearch,
    fullPage,
    rootPageId,
    rootDomain,
    darkMode,
    previewImages,
    forceCustomImages,
    showCollectionViewDropdown,
    linkTableTitleProperties,
    isLinkCollectionToUrlProperty,
    isImageZoomable = true,
    showTableOfContents,
    minTableOfContentsItems,
    defaultPageIcon,
    defaultPageCover,
    defaultPageCoverPosition,
    ...rest
}) => {
    const zoom = React.useMemo(
        () =>
            typeof window !== 'undefined' &&
            mediumZoom({
                background: 'rgba(0, 0, 0, 0.8)',
                minZoomScale: 2.0,
                margin: getMediumZoomMargin()
            }),
        []
    );

    return (
        <NotionContextProvider
            components={components}
            recordMap={recordMap}
            mapPageUrl={mapPageUrl}
            mapImageUrl={mapImageUrl}
            searchNotion={searchNotion}
            isShowingSearch={isShowingSearch}
            onHideSearch={onHideSearch}
            fullPage={fullPage}
            rootPageId={rootPageId}
            rootDomain={rootDomain}
            darkMode={darkMode}
            previewImages={previewImages}
            forceCustomImages={forceCustomImages}
            showCollectionViewDropdown={showCollectionViewDropdown}
            linkTableTitleProperties={linkTableTitleProperties}
            isLinkCollectionToUrlProperty={isLinkCollectionToUrlProperty}
            showTableOfContents={showTableOfContents}
            minTableOfContentsItems={minTableOfContentsItems}
            defaultPageIcon={defaultPageIcon}
            defaultPageCover={defaultPageCover}
            defaultPageCoverPosition={defaultPageCoverPosition}
            zoom={isImageZoomable ? zoom : null}
        >
            {/* eslint-disable-next-line no-use-before-define */}
            <NotionBlockRenderer {...rest} />
        </NotionContextProvider>
    );
};
