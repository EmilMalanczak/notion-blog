import * as types from './types';

export interface NavigationLink {
    title: string;
    pageId?: string;
    url?: string;
}

export interface SiteConfig {
    rootNotionPageId: string;
    rootNotionSpaceId?: string | null;

    name: string;
    domain: string;
    author: string;
    description?: string;
    language?: string;

    twitter?: string;
    linkedin?: string;
    newsletter?: string;
    youtube?: string;

    defaultPageIcon?: string | null;
    defaultPageCover?: string | null;
    defaultPageCoverPosition?: number | null;

    isPreviewImageSupportEnabled?: boolean;
    isTweetEmbedSupportEnabled?: boolean;
    isRedisEnabled?: boolean;
    isSearchEnabled?: boolean;

    includeNotionIdInUrls?: boolean;
    pageUrlOverrides?: types.PageUrlOverridesMap;
    pageUrlAdditions?: types.PageUrlOverridesMap;

    navigationStyle?: types.NavigationStyle;
    navigationLinks?: Array<NavigationLink>;
}

export const siteConfig = (config: SiteConfig): SiteConfig => config;
