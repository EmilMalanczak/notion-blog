import { ExtendedRecordMap } from 'notion-types';
import * as React from 'react';

import { defaultComponents } from './context-components';
import { defaultNotionContext, rendererContext } from './context-root';
import { wrapNextImage, wrapNextLink } from './next';
import { MapImageUrlFn, MapPageUrlFn, NotionComponents, SearchNotionFn } from './types';
import { defaultMapImageUrl, defaultMapPageUrl } from './utils';

export interface PartialNotionContext {
    recordMap: ExtendedRecordMap;
    components: Partial<NotionComponents> | null;

    mapPageUrl: MapPageUrlFn | null;
    mapImageUrl: MapImageUrlFn | null;
    searchNotion: SearchNotionFn | null;
    isShowingSearch: boolean | null;
    onHideSearch: (() => void) | null;

    rootPageId: string | null;
    rootDomain: string | null;

    fullPage?: boolean;
    darkMode?: boolean;
    previewImages?: boolean;
    forceCustomImages?: boolean;
    showCollectionViewDropdown?: boolean;
    linkTableTitleProperties?: boolean;
    isLinkCollectionToUrlProperty?: boolean;

    showTableOfContents?: boolean;
    minTableOfContentsItems?: number;

    defaultPageIcon: string | null;
    defaultPageCover: string | null;
    defaultPageCoverPosition: number | null;

    zoom?: any;
    children: React.ReactNode;
}

export const NotionContextProvider: React.FC<PartialNotionContext> = ({
    components: themeComponents = {},
    children,
    mapPageUrl,
    mapImageUrl,
    rootPageId,
    ...rest
}) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(rest)) {
        if (rest[key as keyof typeof rest] === undefined) {
            delete rest[key as keyof typeof rest];
        }
    }

    const wrappedThemeComponents = React.useMemo(
        () => ({
            ...themeComponents
        }),
        [themeComponents]
    );

    if (wrappedThemeComponents.nextImage) {
        wrappedThemeComponents.Image = wrapNextImage(themeComponents?.nextImage);
    }

    if (wrappedThemeComponents.nextLink) {
        wrappedThemeComponents.nextLink = wrapNextLink(themeComponents?.nextLink);
    }

    // ensure the user can't override default components with falsy values
    // since it would result in very difficult-to-debug react errors
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(wrappedThemeComponents)) {
        if (!wrappedThemeComponents[key as keyof typeof wrappedThemeComponents]) {
            delete wrappedThemeComponents[key as keyof typeof wrappedThemeComponents];
        }
    }

    const value = React.useMemo(
        () => ({
            ...defaultNotionContext,
            ...rest,
            rootPageId,
            mapPageUrl: mapPageUrl ?? defaultMapPageUrl(rootPageId),
            mapImageUrl: mapImageUrl ?? defaultMapImageUrl,
            components: { ...defaultComponents, ...wrappedThemeComponents }
        }),
        [mapImageUrl, mapPageUrl, wrappedThemeComponents, rootPageId, rest]
    );

    return <rendererContext.Provider value={value}>{children}</rendererContext.Provider>;
};
