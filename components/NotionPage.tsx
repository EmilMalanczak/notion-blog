import cs from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PageBlock } from 'notion-types';
import * as React from 'react';
import BodyClassName from 'react-body-classname';
import TweetEmbed from 'react-tweet-embed';
import { useSearchParam } from 'react-use';

import * as config from '@/lib/config';
import { mapImageUrl } from '@/lib/map-image-url';
import { getCanonicalPageUrl, mapPageUrl } from '@/lib/map-page-url';
import { searchNotion } from '@/lib/search-notion';
import * as types from '@/lib/types';
import { useDarkMode } from '@/lib/use-dark-mode';
import { NotionRenderer } from 'renderer/renderer';
import { Code } from 'renderer/third-party/code';
import { Collection } from 'renderer/third-party/collection';
import { Equation } from 'renderer/third-party/equation';
import { Modal } from 'renderer/third-party/modal';
import { Pdf } from 'renderer/third-party/pdf';
import { formatDate } from 'renderer/utils/format-date';
import { getBlockTitle } from 'renderer/utils/get-block-title';
import { getPageProperty } from 'renderer/utils/get-page-property';

import { Footer } from './Footer';
import { Loading } from './Loading';
import { NotionPageHeader } from './NotionPageHeader';
import { Page404 } from './Page404';
import { PageAside } from './PageAside';
import { PageHead } from './PageHead';
import styles from './styles.module.css';

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Tweet = ({ id }: { id: string }) => <TweetEmbed tweetId={id} />;

const propertyLastEditedTimeValue = ({ block, pageHeader }: any, defaultFn: () => React.ReactNode) => {
    if (pageHeader && block?.last_edited_time) {
        return `Last updated ${formatDate(block?.last_edited_time, {
            month: 'long'
        })}`;
    }

    return defaultFn();
};

const propertyDateValue = ({ data, schema, pageHeader }: any, defaultFn: () => React.ReactNode) => {
    if (pageHeader && schema?.name?.toLowerCase() === 'published') {
        const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date;

        if (publishDate) {
            return `${formatDate(publishDate, {
                month: 'long'
            })}`;
        }
    }

    return defaultFn();
};

const propertyTextValue = ({ schema, pageHeader }: any, defaultFn: () => React.ReactNode) => {
    if (pageHeader && schema?.name?.toLowerCase() === 'author') {
        return <b>{defaultFn()}</b>;
    }

    return defaultFn();
};

export const NotionPage: React.FC<Required<types.PageProps>> = ({ site, recordMap, error, pageId }) => {
    const router = useRouter();
    const lite = useSearchParam('lite');

    const components = React.useMemo(
        () => ({
            nextImage: Image,
            nextLink: Link,
            Code,
            Collection,
            Equation,
            Pdf,
            Modal,
            Tweet,
            Header: NotionPageHeader,
            propertyLastEditedTimeValue,
            propertyTextValue,
            propertyDateValue
        }),
        []
    );

    // lite mode is for oembed
    const isLiteMode = lite === 'true';

    const { isDarkMode } = useDarkMode();

    const siteMapPageUrl = React.useMemo(() => {
        const params: any = {};
        if (lite) params.lite = lite;

        const searchParams = new URLSearchParams(params);
        return mapPageUrl(site as types.Site, recordMap, searchParams);
    }, [site, recordMap, lite]);

    const keys = Object.keys(recordMap?.block || {});
    const block = recordMap?.block?.[keys[0]]?.value;

    // const isRootPage =
    //   parsePageId(block?.id) === parsePageId(site?.rootNotionPageId)
    const isBlogPost = block?.type === 'page' && block?.parent_table === 'collection';

    const showTableOfContents = !!isBlogPost;
    const minTableOfContentsItems = 3;

    const pageAside = React.useMemo(
        () => <PageAside block={block} recordMap={recordMap} isBlogPost={isBlogPost} />,
        [block, recordMap, isBlogPost]
    );

    const footer = React.useMemo(() => <Footer />, []);

    if (router.isFallback) {
        return <Loading />;
    }

    if (error || !site || !block) {
        return <Page404 site={site} pageId={pageId} error={error} />;
    }

    const title = getBlockTitle(block, recordMap) || site.name;

    console.log('notion page', {
        isDev: config.isDev,
        title,
        pageId,
        rootNotionPageId: site.rootNotionPageId,
        recordMap
    });

    if (!config.isServer) {
        // add important objects to the window global for easy debugging
        const g = window as any;
        g.pageId = pageId;
        g.recordMap = recordMap;
        g.block = block;
    }

    const canonicalPageUrl = !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId);

    const socialImage = mapImageUrl(
        (getPageProperty<string>('Social Image', block, recordMap) ||
            (block as PageBlock).format?.page_cover ||
            config.defaultPageCover) as string,
        block
    );

    const socialDescription = getPageProperty<string>('Description', block, recordMap) || config.description;

    return (
        <>
            <PageHead
                pageId={pageId}
                site={site}
                title={title}
                description={socialDescription}
                image={socialImage as string}
                url={canonicalPageUrl as string}
            />

            {isLiteMode && <BodyClassName className="notion-lite" />}
            {isDarkMode && <BodyClassName className="dark-mode" />}

            <NotionRenderer
                bodyClassName={cs(styles.notion, pageId === site.rootNotionPageId && 'index-page')}
                darkMode={isDarkMode}
                components={components}
                recordMap={recordMap}
                rootPageId={site.rootNotionPageId}
                rootDomain={site.domain}
                fullPage={!isLiteMode}
                previewImages={!!recordMap.preview_images}
                showCollectionViewDropdown={false}
                showTableOfContents={showTableOfContents}
                minTableOfContentsItems={minTableOfContentsItems}
                defaultPageIcon={config.defaultPageIcon as string}
                defaultPageCover={config.defaultPageCover as string}
                defaultPageCoverPosition={config.defaultPageCoverPosition}
                mapPageUrl={siteMapPageUrl}
                // @ts-ignore
                mapImageUrl={mapImageUrl}
                searchNotion={config.isSearchEnabled ? searchNotion : null}
                pageAside={pageAside}
                footer={footer}
                onHideSearch={null}
                isShowingSearch={false}
            />
        </>
    );
};
