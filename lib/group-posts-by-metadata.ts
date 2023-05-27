import { ExtractedPostsData } from './extract-notion-posts';

const REMOVE_EMPTY_POSTS = true;

function filterEmptyPosts<T extends { posts: any[] }>(postsCollection: T[]) {
    if (!REMOVE_EMPTY_POSTS) {
        return postsCollection;
    }
    return postsCollection.filter((posts) => posts.posts.length > 0);
}

export const groupPostsByMetadata = (postsData: ExtractedPostsData) => {
    const { posts, categories, tags } = postsData;

    const postsByCategory = filterEmptyPosts(
        categories.map((category) => {
            const postsInCategory = posts.filter((post) => post.categories?.includes(category.value));

            return {
                ...category,
                posts: postsInCategory
            };
        })
    );

    const postsByTag = filterEmptyPosts(
        tags.map((tag) => {
            const postsWithTag = posts.filter((post) => post.tags?.includes(tag.value));

            return {
                ...tag,
                posts: postsWithTag
            };
        })
    );

    return {
        postsByCategory,
        postsByTag
    };
};
