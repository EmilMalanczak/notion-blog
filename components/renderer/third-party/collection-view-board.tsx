import { PageBlock } from 'notion-types';
import * as React from 'react';

import { useNotionContext } from '@/components/renderer/context-root';

import { CollectionCard } from './collection-card';
import { CollectionGroup } from './collection-group';
import { getCollectionGroups } from './collection-utils';
import { Property } from './property';

import { EmptyIcon } from '../icons/empty-icon';
import { CollectionViewProps } from '../types';
import { cs } from '../utils';

const Board = ({ collectionView, collectionData, collection, padding }: any) => {
    const { recordMap } = useNotionContext();
    const {
        board_cover = { type: 'none' },
        board_cover_size = 'medium',
        board_cover_aspect = 'cover'
    } = collectionView?.format || {};

    const boardGroups = collectionView?.format?.board_columns || collectionView?.format?.board_groups2 || [];

    const boardStyle = React.useMemo(
        () => ({
            paddingLeft: padding
        }),
        [padding]
    );

    return (
        <div className="notion-board">
            <div className={cs('notion-board-view', `notion-board-view-size-${board_cover_size}`)} style={boardStyle}>
                <div className="notion-board-header">
                    <div className="notion-board-header-inner">
                        {boardGroups.map((p: any, index: number) => {
                            if (!(collectionData as any).board_columns?.results) {
                                // no groupResults in the data when collection is in a toggle
                                return null;
                            }
                            const group = (collectionData as any).board_columns.results![index];
                            const schema = collection.schema[p.property];

                            if (!group || !schema || p.hidden) {
                                return null;
                            }

                            return (
                                // eslint-disable-next-line react/no-array-index-key
                                <div className="notion-board-th" key={index}>
                                    <div className="notion-board-th-body">
                                        {group.value?.value ? (
                                            <Property
                                                schema={schema}
                                                data={[[group.value?.value]]}
                                                collection={collection}
                                            />
                                        ) : (
                                            <span>
                                                <EmptyIcon className="notion-board-th-empty" /> No Select
                                            </span>
                                        )}

                                        <span className="notion-board-th-count">{group.total}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="notion-board-header-placeholder" />

                <div className="notion-board-body">
                    {boardGroups.map((p: any, index: number) => {
                        const boardResults = (collectionData as any).board_columns?.results;
                        if (!boardResults) return null;
                        if (!p?.value?.type) return null;

                        const schema = collection.schema[p.property];
                        const group = (collectionData as any)[
                            `results:${p?.value?.type}:${p?.value?.value || 'uncategorized'}`
                        ];

                        if (!group || !schema || p.hidden) {
                            return null;
                        }

                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <div className="notion-board-group" key={index}>
                                {group.blockIds?.map((blockId: string) => {
                                    const block = recordMap.block[blockId]?.value as PageBlock;
                                    if (!block) return null;

                                    return (
                                        <CollectionCard
                                            className="notion-board-group-card"
                                            collection={collection}
                                            block={block}
                                            cover={board_cover}
                                            coverSize={board_cover_size}
                                            coverAspect={board_cover_aspect}
                                            properties={collectionView.format?.board_properties}
                                            key={blockId}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const CollectionViewBoard: React.FC<CollectionViewProps> = ({
    collection,
    collectionView,
    collectionData,
    padding
}) => {
    const isGroupedCollection = collectionView?.format?.collection_group_by;

    if (isGroupedCollection) {
        const collectionGroups = getCollectionGroups(collection, collectionView, collectionData, padding);

        return collectionGroups.map((group: any, index: number) => (
            <CollectionGroup
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                {...group}
                summaryProps={{
                    style: {
                        paddingLeft: padding
                    }
                }}
                collectionViewComponent={(props) => <Board padding={padding} {...props} />}
            />
        ));
    }

    return (
        <Board
            padding={padding}
            collectionView={collectionView}
            collection={collection}
            collectionData={collectionData}
        />
    );
};
