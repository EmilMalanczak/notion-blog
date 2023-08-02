import { AudioBlock } from 'notion-types';
import * as React from 'react';

import { useNotionContext } from '@/components/renderer/context-root';

import { cs } from '../utils';

export const Audio: React.FC<{
    block: AudioBlock;
    className?: string;
}> = ({ block, className }) => {
    const { recordMap } = useNotionContext();
    const source = recordMap.signed_urls[block.id] || block.properties?.source?.[0]?.[0];

    return (
        <div className={cs('notion-audio', className)}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio controls preload="none" src={source} />
        </div>
    );
};
