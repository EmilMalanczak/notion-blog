/**
 * Site-wide app configuration.
 *
 * This file pulls from the root "site.config.ts" as well as environment variables
 * for optional depenencies.
 */
import { parsePageId } from 'notion-utils';

import { getEnv, getSiteConfig } from './get-config-value';
import { NavigationLink } from './site-config';
import { NavigationStyle, PageUrlOverridesInverseMap, PageUrlOverridesMap, Site } from './types';

function cleanPageUrlMap(
    pageUrlMap: PageUrlOverridesMap,
    {
        label
    }: {
        label: string;
    }
): PageUrlOverridesMap {
    return Object.keys(pageUrlMap).reduce((acc, uri) => {
        const pageId = pageUrlMap[uri];
        const uuid = parsePageId(pageId, { uuid: false });

        if (!uuid) {
            throw new Error(`Invalid ${label} page id "${pageId}"`);
        }

        if (!uri) {
            throw new Error(`Missing ${label} value for page "${pageId}"`);
        }

        if (!uri.startsWith('/')) {
            throw new Error(
                `Invalid ${label} value for page "${pageId}": value "${uri}" should be a relative URI that starts with "/"`
            );
        }

        const path = uri.slice(1);

        return {
            ...acc,
            [path]: uuid
        };
    }, {});
}

function invertPageUrlOverrides(pageUrlOverrides: PageUrlOverridesMap): PageUrlOverridesInverseMap {
    return Object.keys(pageUrlOverrides).reduce((acc, uri) => {
        const pageId = pageUrlOverrides[uri];

        return {
            ...acc,
            [pageId]: uri
        };
    }, {});
}

export const rootNotionPageId: string = parsePageId(getSiteConfig('rootNotionPageId'), { uuid: false });

if (!rootNotionPageId) {
    throw new Error('Config error invalid "rootNotionPageId"');
}

// if you want to restrict pages to a single notion workspace (optional)
export const rootNotionSpaceId: string | null = parsePageId(getSiteConfig('rootNotionSpaceId', undefined), {
    uuid: true
}) as string;

export const pageUrlOverrides = cleanPageUrlMap(getSiteConfig('pageUrlOverrides', {}) || {}, {
    label: 'pageUrlOverrides'
});

export const pageUrlAdditions = cleanPageUrlMap(getSiteConfig('pageUrlAdditions', {}) || {}, {
    label: 'pageUrlAdditions'
});

export const inversePageUrlOverrides = invertPageUrlOverrides(pageUrlOverrides);

export const environment = process.env.NODE_ENV || 'development';
export const isDev = environment === 'development';

// general site config
export const name: string = getSiteConfig('name');
export const author: string = getSiteConfig('author');
export const domain: string = getSiteConfig('domain');
export const description: string = getSiteConfig('description', 'Notion Blog') as string;
export const language: string = getSiteConfig('language', 'en') as string;

// social accounts
export const twitter: string | undefined = getSiteConfig('twitter', null) as string;
export const youtube: string | undefined = getSiteConfig('youtube', null) as string;
export const linkedin: string | undefined = getSiteConfig('linkedin', null) as string;
export const newsletter: string | undefined = getSiteConfig('newsletter', null) as string;

// default notion values for site-wide consistency (optional; may be overridden on a per-page basis)
export const defaultPageIcon: string | null = getSiteConfig('defaultPageIcon', null) as string;
export const defaultPageCover: string | null = getSiteConfig('defaultPageCover', null) as string;
export const defaultPageCoverPosition: number = getSiteConfig('defaultPageCoverPosition', 0.5) as number;

// Optional whether or not to enable support for LQIP preview images
export const isPreviewImageSupportEnabled: boolean = getSiteConfig('isPreviewImageSupportEnabled', false) as boolean;

// Optional whether or not to include the Notion ID in page URLs or just use slugs
export const includeNotionIdInUrls: boolean = getSiteConfig('includeNotionIdInUrls', !!isDev) as boolean;

export const navigationStyle: NavigationStyle = getSiteConfig('navigationStyle', 'default') as 'default';

export const navigationLinks: Array<NavigationLink | null> = getSiteConfig('navigationLinks', []) || [];

// Optional site search
export const isSearchEnabled: boolean = getSiteConfig('isSearchEnabled', true) as boolean;

export const isServer = typeof window === 'undefined';

export const port = getEnv('PORT', '3000');
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`;
export const apiHost = isDev ? host : `https://${process.env.VERCEL_URL || domain}`;

export const apiBaseUrl = `/api`;

export const api = {
    searchNotion: `${apiBaseUrl}/search-notion`,
    getNotionPageInfo: `${apiBaseUrl}/notion-page-info`,
    getSocialImage: `${apiBaseUrl}/social-image`
};

// ----------------------------------------------------------------------------

export const site: Site = {
    domain,
    name,
    rootNotionPageId,
    rootNotionSpaceId,
    description
};
