import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Category = any;
type Tag = any;

interface BearState {
    categories: Category[];
    tags: Tag[];
    setCategories: (by: Category[]) => void;
    setTags: (by: Tag[]) => void;
}

export const useBlogStore = create<BearState>()(
    devtools(
        (set) => ({
            tags: [],
            categories: [],
            setCategories: (categories) => set((state) => ({ categories: [...state.categories, ...categories] })),
            setTags: (tags) => set((state) => ({ tags: [...state.tags, ...tags] }))
        }),
        {
            name: 'blog-storage'
        }
    )
);
