import React from 'react';

import { ExtendedRecordMap } from '@/lib/types';

import { defaultComponents } from './context-components';
import { MapImageUrlFn, MapPageUrlFn, NotionComponents, SearchNotionFn } from './types';
import { defaultMapImageUrl, defaultMapPageUrl } from './utils';

export type NotionContext = {
    recordMap: ExtendedRecordMap;
    components: NotionComponents;

    mapPageUrl: MapPageUrlFn;
    mapImageUrl: MapImageUrlFn;
    searchNotion: SearchNotionFn | null;
    isShowingSearch: boolean | null;
    onHideSearch: (() => void) | null;

    rootPageId: string | null;
    rootDomain: string | null;

    fullPage: boolean;
    darkMode: boolean;
    previewImages: boolean;
    forceCustomImages: boolean;
    showCollectionViewDropdown: boolean;
    showTableOfContents: boolean;
    minTableOfContentsItems: number;
    linkTableTitleProperties: boolean;
    isLinkCollectionToUrlProperty: boolean;

    defaultPageIcon: string | null;
    defaultPageCover: string | null;
    defaultPageCoverPosition: number | null;

    zoom: any;
};

export const defaultNotionContext: NotionContext = {
    recordMap: {
        block: {},
        collection: {},
        collection_view: {},
        collection_query: {},
        notion_user: {},
        signed_urls: {}
    },
    rootDomain: null,
    rootPageId: null,

    components: defaultComponents,

    mapPageUrl: defaultMapPageUrl(),
    mapImageUrl: defaultMapImageUrl as any,
    searchNotion: null,
    isShowingSearch: false,
    onHideSearch: null as any,

    fullPage: false,
    darkMode: false,
    previewImages: false,
    forceCustomImages: false,
    showCollectionViewDropdown: true,
    linkTableTitleProperties: true,
    isLinkCollectionToUrlProperty: false,

    showTableOfContents: false,
    minTableOfContentsItems: 3,

    defaultPageIcon: null,
    defaultPageCover: null,
    defaultPageCoverPosition: 0.5,

    zoom: null
};

export const rendererContext = React.createContext<NotionContext>(defaultNotionContext);

export const NotionContextConsumer = rendererContext.Consumer;

export const useNotionContext = (): NotionContext => React.useContext(rendererContext);
