import { FC, createContext, useMemo, useContext, ReactNode } from 'react';

import { SelectOption } from '@/lib/types';

// Define the shape of the layout context
type LayoutContextValue = {
    categories: SelectOption[];
    tags: SelectOption[];
};

// Create the layout context
const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

// Create a custom hook to access the layout context
export const useLayoutContext = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayoutContext must be used within a LayoutProvider');
    }
    return context;
};

// Create the layout provider component
type LayoutProviderProps = LayoutContextValue & {
    children: ReactNode;
};

export const LayoutProvider: FC<LayoutProviderProps> = ({ categories = [], tags = [], children }) => {
    const memoizedData = useMemo(() => ({ categories, tags }), [categories, tags]);

    return <LayoutContext.Provider value={memoizedData}>{children}</LayoutContext.Provider>;
};
