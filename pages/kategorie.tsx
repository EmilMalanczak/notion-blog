import { Title } from '@mantine/core';
import * as React from 'react';

import { Layout } from '@/components/layout/layout';
import { TagsList } from '@/components/tags-list';
import { domain } from '@/lib/config';
import { ExtractedArticlesData, extractNotionArticles } from '@/lib/extract-notion-articles';
import { GroupedArticles } from '@/lib/group-posts-by-metadata';
import { resolveNotionPage } from '@/lib/resolve-notion-page';

export const getStaticProps = async () => {
    try {
        const props = await resolveNotionPage(domain);

        // TODO VALIDATION
        // @ts-ignore
        const { recordMap } = props;

        const articlesData = extractNotionArticles(recordMap);

        return { props: { ...props, ...articlesData }, revalidate: 10 };
    } catch (err) {
        console.error('page error', domain, err);

        // we don't want to publish the error version of this page, so
        // let next.js know explicitly that incremental SSG failed
        throw err;
    }
};

const NotionDomainPage = ({ categories, tags }: ExtractedArticlesData & GroupedArticles) => (
    <Layout categories={categories} tags={tags}>
        <div style={{ backgroundColor: 'white', padding: 8 }}>
            <Title order={1} pl={8} pt={8}>
                Wszystkie kategorie
            </Title>
            <TagsList />
        </div>
    </Layout>
);

export default NotionDomainPage;
