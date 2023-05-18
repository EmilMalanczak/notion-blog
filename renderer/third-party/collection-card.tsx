import { ImageBlock } from 'notion-types';
import * as React from 'react';

import { NotionContextProvider } from 'renderer/context';
import { dummyLink } from 'renderer/context-components';
import { useNotionContext } from 'renderer/context-root';
import { getTextContent } from 'renderer/utils/get-text-content';

import { Property } from './property';

import { LazyImage } from '../components/lazy-image';
import { CollectionCardProps } from '../types';
import { cs } from '../utils';

export const CollectionCard: React.FC<CollectionCardProps> = ({
    collection,
    block,
    cover,
    coverSize,
    coverAspect,
    properties,
    className,
    ...rest
}) => {
    const ctx = useNotionContext();
    const { components, recordMap, mapPageUrl, mapImageUrl, isLinkCollectionToUrlProperty } = ctx;
    let coverContent = null;

    const { page_cover_position = 0.5 } = block.format || {};
    const coverPosition = (1 - page_cover_position) * 100;

    if (cover?.type === 'page_content') {
        const contentBlockId = block.content?.find((blockId) => {
            const b = recordMap.block[blockId]?.value;

            if (b?.type === 'image') {
                return true;
            }

            return false;
        });

        if (contentBlockId) {
            const contentBlock = recordMap.block[contentBlockId]?.value as ImageBlock;

            const source = contentBlock.properties?.source?.[0]?.[0] ?? contentBlock.format?.display_source;

            if (source) {
                const src = mapImageUrl(source, contentBlock);
                const caption = contentBlock.properties?.caption?.[0]?.[0];

                coverContent = (
                    <LazyImage
                        src={src ?? ''}
                        alt={caption || 'notion image'}
                        style={{
                            objectFit: coverAspect
                        }}
                    />
                );
            }
        }

        if (!coverContent) {
            coverContent = <div className="notion-collection-card-cover-empty" />;
        }
    } else if (cover?.type === 'page_cover') {
        const { page_cover } = block.format || {};

        if (page_cover) {
            const coverPos = (1 - page_cover_position) * 100;

            coverContent = (
                <LazyImage
                    src={mapImageUrl(page_cover, block) ?? ''}
                    alt={getTextContent(block.properties?.title)}
                    style={{
                        objectFit: coverAspect,
                        objectPosition: `center ${coverPos}%`
                    }}
                />
            );
        }
    } else if (cover?.type === 'property') {
        const { property } = cover;
        const schema = collection.schema[property as string];
        // @ts-ignore
        const data = block.properties?.[property as string];

        if (schema && data) {
            if (schema.type === 'file') {
                const files = data.filter((v: any) => v.length === 2).map((f: any) => f.flat().flat());
                const file = files[0];

                if (file) {
                    coverContent = (
                        <span className={`notion-property-${schema.type}`}>
                            <LazyImage
                                alt={file[0] as string}
                                src={mapImageUrl(file[2] as string, block) ?? ''}
                                style={{
                                    objectFit: coverAspect,
                                    objectPosition: `center ${coverPosition}%`
                                }}
                            />
                        </span>
                    );
                }
            } else {
                coverContent = <Property schema={schema} data={data} />;
            }
        }
    }
    let linkProperties: any[] = [];
    // check if a visible property has a url and we settings are for linking to it for the card
    if (isLinkCollectionToUrlProperty) {
        linkProperties =
            properties
                ?.filter((p) => p.visible && p.property !== 'title' && collection.schema[p.property])
                .filter((p) => {
                    if (!block.properties) return false;
                    const schema = collection.schema[p.property];

                    return schema.type === 'url';
                })
                // @ts-ignore
                .map((p) => block?.properties[p.property])
                ?.filter((p) => p && p.length > 0 && p[0] !== undefined) ?? []; // case where the url is empty
    }
    let url = null;
    if (
        linkProperties &&
        linkProperties.length > 0 &&
        linkProperties[0].length > 0 &&
        linkProperties[0][0].length > 0
    ) {
        // TODO: remove this
        // eslint-disable-next-line prefer-destructuring
        url = linkProperties[0][0][0];
    }

    const innerCard = (
        <>
            {(coverContent || cover?.type !== 'none') && (
                <div className="notion-collection-card-cover">{coverContent}</div>
            )}

            <div className="notion-collection-card-body">
                <div className="notion-collection-card-property">
                    <Property
                        schema={collection.schema.title}
                        data={block?.properties?.title}
                        block={block}
                        collection={collection}
                    />
                </div>

                {properties
                    ?.filter((p) => p.visible && p.property !== 'title' && collection.schema[p.property])
                    .map((p) => {
                        if (!block.properties) return null;
                        const schema = collection.schema[p.property];
                        // @ts-ignore
                        const data = block.properties[p.property];

                        return (
                            <div className="notion-collection-card-property" key={p.property}>
                                <Property schema={schema} data={data} block={block} collection={collection} inline />
                            </div>
                        );
                    })}
            </div>
        </>
    );

    return (
        <NotionContextProvider
            {...ctx}
            components={{
                ...ctx.components,
                // Disable <a> tabs in all child components so we don't create invalid DOM
                // trees with stacked <a> tags.
                // eslint-disable-next-line react/no-unstable-nested-components
                Link: (props: any) => (
                    // eslint-disable-next-line react/destructuring-assignment
                    <form action={props.href} target="_blank">
                        <input
                            type="submit"
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props?.children?.props?.children ?? props.href}
                            className="nested-form-link notion-link"
                        />
                    </form>
                ),
                PageLink: dummyLink
            }}
        >
            {isLinkCollectionToUrlProperty && url ? (
                <components.Link
                    className={cs('notion-collection-card', `notion-collection-card-size-${coverSize}`, className)}
                    href={url}
                    {...rest}
                >
                    {innerCard}
                </components.Link>
            ) : (
                <components.PageLink
                    className={cs('notion-collection-card', `notion-collection-card-size-${coverSize}`, className)}
                    href={mapPageUrl(block.id)}
                    {...rest}
                >
                    {innerCard}
                </components.PageLink>
            )}
        </NotionContextProvider>
    );
};
