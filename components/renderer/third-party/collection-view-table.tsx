import * as React from 'react';

import { useNotionContext } from '@/components/renderer/context-root';

import { CollectionColumnTitle } from './collection-column-title';
import { CollectionGroup } from './collection-group';
import { getCollectionGroups } from './collection-utils';
import { Property } from './property';

import { CollectionViewProps } from '../types';
import { cs } from '../utils';

const defaultBlockIds: any[] = [];

const Table = ({ blockIds = [], collection, collectionView, width, padding }: any) => {
    const { recordMap, linkTableTitleProperties } = useNotionContext();

    const tableStyle = React.useMemo(
        () => ({
            width,
            maxWidth: width
        }),
        [width]
    );

    const tableViewStyle = React.useMemo(
        () => ({
            paddingLeft: padding,
            paddingRight: padding
        }),
        [padding]
    );

    let properties: any[] = [];

    if (collectionView.format?.table_properties) {
        properties = collectionView.format.table_properties.filter(
            (p: any) => p.visible && collection.schema[p.property]
        );
    } else {
        properties = [{ property: 'title' }].concat(
            Object.keys(collection.schema)
                .filter((p) => p !== 'title')
                .map((property) => ({ property }))
        );
    }

    return (
        <div className="notion-table" style={tableStyle}>
            <div className="notion-table-view" style={tableViewStyle}>
                {!!properties.length && (
                    <>
                        <div className="notion-table-header">
                            <div className="notion-table-header-inner">
                                {properties.map((p) => {
                                    const schema = collection.schema?.[p.property];
                                    const isTitle = p.property === 'title';
                                    const style: React.CSSProperties = {};

                                    if (p.width) {
                                        style.width = p.width;
                                    } else if (isTitle) {
                                        style.width = 280;
                                    } else {
                                        style.width = 200;
                                        // style.width = `${100.0 / properties.length}%`
                                    }

                                    return (
                                        <div className="notion-table-th" key={p.property}>
                                            <div className="notion-table-view-header-cell" style={style}>
                                                <div className="notion-table-view-header-cell-inner">
                                                    <CollectionColumnTitle schema={schema} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="notion-table-header-placeholder" />

                        <div className="notion-table-body">
                            {blockIds?.map((blockId: any) => (
                                <div className="notion-table-row" key={blockId}>
                                    {properties.map((p) => {
                                        const schema = collection.schema?.[p.property];
                                        const block = recordMap.block[blockId]?.value;
                                        const data = block?.properties?.[p.property];
                                        const isTitle = p.property === 'title';
                                        const style: React.CSSProperties = {};

                                        if (p.width) {
                                            style.width = p.width;
                                        } else if (isTitle) {
                                            style.width = 280;
                                        } else {
                                            style.width = 200;
                                            // style.width = `${100.0 / properties.length}%`
                                        }

                                        return (
                                            <div
                                                key={p.property}
                                                className={cs('notion-table-cell', `notion-table-cell-${schema.type}`)}
                                                style={style}
                                            >
                                                <Property
                                                    schema={schema}
                                                    data={data}
                                                    block={block}
                                                    collection={collection}
                                                    linkToTitlePage={linkTableTitleProperties}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const CollectionViewTable: React.FC<CollectionViewProps> = ({
    collection,
    collectionView,
    collectionData,
    padding,
    width
}) => {
    const isGroupedCollection = collectionView?.format?.collection_group_by;

    if (isGroupedCollection) {
        const collectionGroups = getCollectionGroups(collection, collectionView, collectionData, padding, width);

        return collectionGroups.map((group: any, index: number) => (
            <CollectionGroup
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                {...group}
                collectionViewComponent={(props) => <Table {...props} padding={padding} width={width} />}
                summaryProps={{
                    style: {
                        paddingLeft: padding,
                        paddingRight: padding
                    }
                }}
            />
        ));
    }

    const blockIds = (collectionData.collection_group_results?.blockIds ?? collectionData.blockIds) || defaultBlockIds;

    return (
        <Table
            blockIds={blockIds}
            collection={collection}
            collectionView={collectionView}
            padding={padding}
            width={width}
        />
    );
};
