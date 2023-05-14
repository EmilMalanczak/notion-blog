import { PageBlock } from 'notion-types';
import * as React from 'react';

import { useNotionContext } from 'renderer/context-root';

import { CollectionCard } from './collection-card';
import { CollectionGroup } from './collection-group';
import { getCollectionGroups } from './collection-utils';

import { CollectionViewProps } from '../types';
import { cs } from '../utils';

const defaultBlockIds: any[] = [];

const Gallery = ({ blockIds, collectionView, collection }: any) => {
    const { recordMap } = useNotionContext();
    const {
        gallery_cover = { type: 'none' },
        gallery_cover_size = 'medium',
        gallery_cover_aspect = 'cover'
    } = collectionView.format || {};

    return (
        <div className="notion-gallery">
            <div className="notion-gallery-view">
                <div className={cs('notion-gallery-grid', `notion-gallery-grid-size-${gallery_cover_size}`)}>
                    {blockIds?.map((blockId: any) => {
                        const block = recordMap.block[blockId]?.value as PageBlock;
                        if (!block) return null;

                        return (
                            <CollectionCard
                                collection={collection}
                                block={block}
                                cover={gallery_cover}
                                coverSize={gallery_cover_size}
                                coverAspect={gallery_cover_aspect}
                                properties={collectionView.format?.gallery_properties}
                                key={blockId}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const CollectionViewGallery: React.FC<CollectionViewProps> = ({
    collection,
    collectionView,
    collectionData
}) => {
    const isGroupedCollection = collectionView?.format?.collection_group_by;

    if (isGroupedCollection) {
        const collectionGroups = getCollectionGroups(collection, collectionView, collectionData);

        return collectionGroups.map((group: any, index: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <CollectionGroup key={index} {...group} collectionViewComponent={Gallery} />
        ));
    }

    const blockIds =
        (collectionData.collection_group_results?.blockIds ??
            // @ts-ignore
            collectionData['results:relation:uncategorized']?.blockIds ??
            collectionData.blockIds) ||
        defaultBlockIds;

    return <Gallery collectionView={collectionView} collection={collection} blockIds={blockIds} />;
};
