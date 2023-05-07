import { getAllPagesInSpace, uuidToId } from 'notion-utils';
import pMemoize from 'p-memoize';

import * as config from '@/lib/config';

import { includeNotionIdInUrls } from './config';
import { getCanonicalPageId } from './get-canonical-page-id';
import { notion } from './notion-api';
import * as types from './types';

const uuid = !!includeNotionIdInUrls;

async function getAllPagesImpl(rootNotionPageId: string, rootNotionSpaceId: string): Promise<Partial<types.SiteMap>> {
    const getPage = async (pageId: string, ...args: any[]) => {
        console.log('\nnotion getPage', uuidToId(pageId));
        return notion.getPage(pageId, ...args);
    };

    const pageMap = await getAllPagesInSpace(rootNotionPageId, rootNotionSpaceId, getPage);

    const canonicalPageMap = Object.keys(pageMap).reduce((map, pageId: string) => {
        const recordMap = pageMap[pageId];
        if (!recordMap) {
            throw new Error(`Error loading page "${pageId}"`);
        }

        const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
            uuid
        }) as string;

        if (map[canonicalPageId]) {
            // you can have multiple pages in different collections that have the same id
            // TODO: we may want to error if neither entry is a collection page
            console.warn('error duplicate canonical page id', {
                canonicalPageId,
                pageId,
                existingPageId: map[canonicalPageId]
            });

            return map;
        }
        return {
            ...map,
            [canonicalPageId]: pageId
        };
    }, {} as types.CanonicalPageMap);

    return {
        pageMap,
        canonicalPageMap
    };
}

const getAllPages = pMemoize(getAllPagesImpl, {
    cacheKey: (...args) => JSON.stringify(args)
});

export async function getSiteMap(): Promise<types.SiteMap> {
    const partialSiteMap = await getAllPages(config.rootNotionPageId, config.rootNotionSpaceId as string);

    return {
        site: config.site,
        ...partialSiteMap
    } as types.SiteMap;
}
