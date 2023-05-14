import { Block } from 'notion-types';

import { defaultMapImageUrl } from 'renderer/map-image-url';

import { defaultPageCover, defaultPageIcon } from './config';

export const mapImageUrl = (url: string, block: Block) => {
    if (url === defaultPageCover || url === defaultPageIcon) {
        return url;
    }

    return defaultMapImageUrl(url, block);
};
