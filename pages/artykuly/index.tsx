import { Title } from '@mantine/core';
import * as React from 'react';

import { Layout } from '@/components/layout/layout';
import { PaginatedArticles } from '@/components/paginated-articles';
import { domain } from '@/lib/config';
import { ExtractedArticlesData, extractNotionArticles } from '@/lib/extract-notion-articles';
import { GroupedArticles, filterKioArticles, groupArticlesByMetadata } from '@/lib/group-posts-by-metadata';
import { resolveNotionPage } from '@/lib/resolve-notion-page';

export const getStaticProps = async () => {
    try {
        const props = await resolveNotionPage(domain);

        // TODO VALIDATION
        // @ts-ignore
        const { recordMap } = props;

        const articlesData = extractNotionArticles(recordMap);
        const groupedArticles = groupArticlesByMetadata(articlesData);
        const kioArticles = filterKioArticles(articlesData);

        return { props: { ...props, ...groupedArticles, ...articlesData, kioArticles }, revalidate: 10 };
    } catch (err) {
        console.error('page error', domain, err);

        // we don't want to publish the error version of this page, so
        // let next.js know explicitly that incremental SSG failed
        throw err;
    }
};

const NotionDomainPage = ({ articles, categories, tags }: ExtractedArticlesData & GroupedArticles) => (
    <Layout categories={categories} tags={tags}>
        <Title order={1} mt={32} mb={16}>
            Wszystkie artykuły
        </Title>
        <PaginatedArticles articles={articles} perPage={9} />
    </Layout>
);

export default NotionDomainPage;
