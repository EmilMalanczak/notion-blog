export const defaultMapPageUrl = (rootPageId?: string | null) => (pageId: string) => {
    const id = (pageId || '').replace(/-/g, '');

    if (rootPageId && pageId === rootPageId) {
        return '/';
    }
    return `/${id}`;
};
