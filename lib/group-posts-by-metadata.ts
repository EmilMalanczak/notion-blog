import { Article, ExtractedArticlesData } from './extract-notion-articles';
import { SelectOption } from './types';

const REMOVE_EMPTY_POSTS = true;

export type GroupedArticles = Record<
    'articlesByCategory' | 'articlesByTag',
    (SelectOption & { articles: Article[] })[]
>;

function filterEmptyArticles<T extends { articles: any[] }>(articlesCollections: T[]) {
    if (!REMOVE_EMPTY_POSTS) {
        return articlesCollections;
    }
    return articlesCollections.filter((collection) => collection.articles.length > 0);
}

export const groupArticlesByMetadata = (postsData: ExtractedArticlesData): GroupedArticles => {
    const { articles, categories, tags } = postsData;

    const articlesByCategory = filterEmptyArticles(
        categories.map((category) => {
            const postsInCategory = articles.filter((article) => article.categories?.includes(category.value));

            return {
                ...category,
                articles: postsInCategory
            };
        })
    );

    const articlesByTag = filterEmptyArticles(
        tags.map((tag) => {
            const postsWithTag = articles.filter((article) => article.tags?.includes(tag.value));

            return {
                ...tag,
                articles: postsWithTag
            };
        })
    );

    return {
        articlesByCategory,
        articlesByTag
    };
};

export const filterKioArticles = (postsData: ExtractedArticlesData): Article[] => {
    console.log('FILTER', postsData);

    const kioArticles = postsData.articles?.filter((article) => article.kio);

    return kioArticles;
};
