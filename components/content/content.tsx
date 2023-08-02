import { Box, SimpleGrid } from '@mantine/core';
import { Fragment } from 'react';

import { Article } from '@/lib/extract-notion-articles';

import { ArticleCard } from '../article/article-card';
import { ArticleCardPrimary } from '../article/article-card-primary';

type Props = {
    articles: Article[];
};

export const Content = ({ articles }: Props) => (
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
);
