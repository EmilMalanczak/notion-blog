import { PageBlock } from 'notion-types';
import * as React from 'react';

import { useNotionContext } from 'renderer/context-root';
import { useBlogStore } from 'store/blog';

import { CollectionColumnTitle } from './collection-column-title';
import { Property } from './property';

import { cs } from '../utils';

export const CollectionRow: React.FC<{
    block: PageBlock;
    className?: string;
}> = ({ block, className }) => {
    const { recordMap } = useNotionContext();
    const collectionId = block.parent_id;
    const collection = recordMap.collection[collectionId]?.value;
    const schemas = collection?.schema;
    const setTags = useBlogStore((state) => state.setTags);

    if (!collection || !schemas) {
        return null;
    }

    console.log({
        block,
        schemas,
        collection
    });

    let propertyIds = Object.keys(schemas).filter((id) => id !== 'title');

    // filter properties based on visibility
    if (collection.format?.property_visibility) {
        propertyIds = propertyIds.filter(
            (id) =>
                collection?.format?.property_visibility?.find(({ property }) => property === id)?.visibility !== 'hide'
        );
    }

    // sort properties
    if (collection.format?.collection_page_properties) {
        // sort properties based on collection page order
        const idToIndex: any = collection.format?.collection_page_properties.reduce(
            (acc, p, i) => ({
                ...acc,
                [p.property]: i
            }),
            {}
        );

        propertyIds.sort((a, b) => idToIndex[a] - idToIndex[b]);
    } else {
        // default to sorting properties alphabetically based on name
        propertyIds.sort((a, b) => schemas[a].name.localeCompare(schemas[b].name));
    }

    return (
        <div className={cs('notion-collection-row', className)}>
            <div className="notion-collection-row-body">
                {propertyIds.map((propertyId) => {
                    const schema = schemas[propertyId];
                    // console.log('SCHEMA', schema);

                    if (schema.name === 'Tags') {
                        const tags = schema.options?.map((option) => option.value);

                        console.log('TAGS', tags);

                        setTags(tags || []);
                    }

                    return (
                        <div className="notion-collection-row-property" key={propertyId}>
                            <CollectionColumnTitle schema={schema} />

                            <div className="notion-collection-row-value">
                                <Property
                                    schema={schema}
                                    // @ts-ignore
                                    data={block.properties?.[propertyId]}
                                    block={block}
                                    collection={collection}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
