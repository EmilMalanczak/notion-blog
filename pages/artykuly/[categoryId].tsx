import { Title } from '@mantine/core';
import { GetStaticPathsResult, GetStaticProps } from 'next';
import * as React from 'react';

import { Layout } from '@/components/layout/layout';
import { PaginatedArticles } from '@/components/paginated-articles';
import { domain, isDev } from '@/lib/config';
import { ExtractedArticlesData, extractNotionArticles } from '@/lib/extract-notion-articles';
import { GroupedArticles, groupArticlesByMetadata } from '@/lib/group-posts-by-metadata';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { PageProps, Params } from '@/lib/types';

export const getStaticProps: GetStaticProps<PageProps, Params> = async (context) => {
    const categoryId = context?.params?.categoryId as string;

    try {
        const props = await resolveNotionPage(domain);

        // @ts-ignore
        const { recordMap } = props;

        const articlesData = extractNotionArticles(recordMap);
        const groupedArticles = groupArticlesByMetadata(articlesData);

        // categories removed and tags became the categories so needs to be adjusted
        const categoryArticles = groupedArticles.articlesByTag.find((category) => category.id === categoryId)?.articles;

        return {
            props: { ...props, ...articlesData, categoryArticles: categoryArticles ?? [] },
            revalidate: 60 * 60 * 1000
        };
    } catch (err) {
        console.error('page error', domain, categoryId, err);

        // we don't want to publish the error version of this page, so
        // let next.js know explicitly that incremental SSG failed
        throw err;
    }
};

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    if (isDev) {
        return {
            paths: [],
            fallback: true
        };
    }

    const props = await resolveNotionPage(domain);

    // @ts-ignore
    const { recordMap } = props;

    const articlesData = extractNotionArticles(recordMap);
    const groupedArticles = groupArticlesByMetadata(articlesData);

    const staticPaths = {
        paths: groupedArticles.articlesByTag.map((tag) => ({
            params: {
                categoryId: tag.id
            }
        })),
        // paths: [],
        fallback: true
    };

    console.log('PATHS', staticPaths.paths);
    return staticPaths;
}

const NotionDomainDynamicPage = ({
    categoryArticles,
    categories,
    tags
}: ExtractedArticlesData & GroupedArticles & any) => (
    <Layout categories={categories} tags={tags}>
        <Title order={1} mt={32} mb={16}>
            Wszystkie artykuły
        </Title>
        <PaginatedArticles articles={categoryArticles} perPage={9} />
    </Layout>
);

export default NotionDomainDynamicPage;
