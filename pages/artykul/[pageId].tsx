import { GetStaticProps } from 'next';
import * as React from 'react';

import { Layout } from '@/components/layout/layout';
import { NotionPage } from '@/components/notion/NotionPage';
import { domain, isDev } from '@/lib/config';
import { ExtractedArticlesData, extractNotionArticles } from '@/lib/extract-notion-articles';
import { getSiteMap } from '@/lib/get-site-map';
import { GroupedArticles, groupArticlesByMetadata } from '@/lib/group-posts-by-metadata';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { PageProps, Params } from '@/lib/types';

export const getStaticProps: GetStaticProps<PageProps, Params> = async (context) => {
    const rawPageId = context?.params?.pageId as string;

    try {
        const props = await resolveNotionPage(domain, rawPageId);

        // @ts-ignoreS
        const { recordMap } = props;

        const articlesData = extractNotionArticles(recordMap);
        const groupedArticles = groupArticlesByMetadata(articlesData);

        return { props: { ...props, ...articlesData, ...groupedArticles }, revalidate: 10 };
    } catch (err) {
        console.error('page error', domain, rawPageId, err);

        // we don't want to publish the error version of this page, so
        // let next.js know explicitly that incremental SSG failed
        throw err;
    }
};

export async function getStaticPaths() {
    if (isDev) {
        return {
            paths: [],
            fallback: true
        };
    }

    const siteMap = await getSiteMap();

    const staticPaths = {
        paths: Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
            params: {
                pageId
            }
        })),
        // paths: [],
        fallback: true
    };

    console.log(staticPaths.paths);
    return staticPaths;
}

const NotionDomainDynamicPage = ({ categories, tags, ...props }: ExtractedArticlesData & GroupedArticles) => (
    <Layout categories={categories} tags={tags}>
        <NotionPage {...props} />
    </Layout>
);

export default NotionDomainDynamicPage;
