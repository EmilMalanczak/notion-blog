import { Center, Pagination, SimpleGrid } from '@mantine/core';
import { useMemo, useState } from 'react';

import { Article } from '@/lib/extract-notion-articles';
import { chunk } from 'utils/chunk';

import { ArticleCard } from './article/article-card';

type Props = {
    perPage: number;
    articles: Article[];
};

export const PaginatedArticles = ({ articles = [], perPage }: Props) => {
    const chunkedArticles = useMemo(
        () => (perPage > articles.length ? [articles] : chunk(articles, perPage)),
        [articles, perPage]
    );
    console.log(articles);

    const [activePage, setActivePage] = useState(1);

    return (
        <div>
            <SimpleGrid
                cols={3}
                breakpoints={[
                    { maxWidth: 'sm', cols: 1 },
                    { maxWidth: 'md', cols: 2 }
                ]}
                py={16}
            >
                {chunkedArticles[activePage - 1].map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </SimpleGrid>

            <Center my={16}>
                <Pagination
                    value={activePage}
                    onChange={setActivePage}
                    total={chunkedArticles.length}
                    boundaries={2}
                    defaultValue={1}
                />
            </Center>
        </div>
    );
};
