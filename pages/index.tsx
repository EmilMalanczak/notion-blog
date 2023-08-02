import { Box, SimpleGrid, createStyles, rem } from '@mantine/core';
import * as React from 'react';
import { Fragment } from 'react';

import { ArticleCard } from '@/components/article/article-card';
import { ArticleCardPrimary } from '@/components/article/article-card-primary';
import { Aside } from '@/components/aside/aside';
import { Layout } from '@/components/layout/layout';
import { TagsList } from '@/components/tags-list';
import { domain } from '@/lib/config';
import { Article, ExtractedArticlesData, extractNotionArticles } from '@/lib/extract-notion-articles';
import { filterKioArticles } from '@/lib/group-posts-by-metadata';
import { resolveNotionPage } from '@/lib/resolve-notion-page';

export const getStaticProps = async () => {
    try {
        const props = await resolveNotionPage(domain);

        console.log('PAGE', props);
        // TODO VALIDATION
        // @ts-ignore
        const { recordMap } = props;

        const articlesData = extractNotionArticles(recordMap);
        const kioArticles = filterKioArticles(articlesData);

        return {
            props: {
                ...props,
                ...articlesData,
                articles: articlesData.articles.slice(0, 7),
                kioArticles: kioArticles.slice(0, 5)
            },
            revalidate: 10
        };
    } catch (err) {
        console.error('page error', domain, err);

        // we don't want to publish the error version of this page, so
        // let next.js know explicitly that incremental SSG failed
        throw err;
    }
};

const useStyles = createStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        width: '100%',
        gap: rem(16),

        [theme.fn.smallerThan('md')]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'repeat(2, auto)'
        }
    }
}));

const NotionDomainPage = ({
    articles,
    categories,
    tags,
    kioArticles
}: ExtractedArticlesData & { kioArticles: Article[] }) => {
    const { classes } = useStyles();

    return (
        <Layout categories={categories} tags={tags}>
            <div className={classes.container}>
                <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} py={16}>
                    {articles.map((article, i) => (
                        <Fragment key={article.id}>
                            {i === 0 ? (
                                <Box
                                    sx={(theme) => ({
                                        gridColumn: '1 / 3',

                                        [theme.fn.smallerThan('sm')]: {
                                            gridColumn: '1 / 2'
                                        }
                                    })}
                                >
                                    <ArticleCardPrimary article={article} />
                                </Box>
                            ) : (
                                <ArticleCard article={article} key={article.id} />
                            )}
                        </Fragment>
                    ))}
                </SimpleGrid>

                <Aside kioArticles={kioArticles} />
            </div>
            <TagsList />
        </Layout>
    );
};

export default NotionDomainPage;
