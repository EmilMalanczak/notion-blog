import { ExtendedRecordMap, SelectOption } from './types';

export type ExtractedPostsData = {
    posts: any[];
    categories: SelectOption[];
    tags: SelectOption[];
};

export const extractNotionPosts = (recordMap: ExtendedRecordMap): ExtractedPostsData => {
    const rawPosts = Object.values(recordMap.block as ExtendedRecordMap['block']).filter(
        (b) => b.value.type === 'page' && b.value.parent_table === 'collection'
    );

    const metadataOptions: Record<string, SelectOption[]> = {
        categories: [],
        tags: []
    };

    const posts = rawPosts.map((p: any) => {
        const simpleTransformingKeys = ['Author', 'Name', 'Description'];
        const stringArrayTransformingKeys = ['Tags', 'Categories'];

        const collectionData = recordMap.collection[p.value.parent_id]?.value;

        // replace the non-meaning schema key with its name
        const postMetadata = Object.entries(p.value.properties).map(([key, metadata]) => {
            const data = collectionData?.schema[key];
            const metadataName = data?.name;

            if (stringArrayTransformingKeys.includes(metadataName)) {
                metadataOptions[metadataName.toLowerCase() as keyof typeof metadataOptions] = data?.options || [];
            }

            console.log(key, ...(metadata as any));

            return [metadataName, metadata];
        });

        // get pure data for articles cards to rid of the notion rerenderer on mainpage
        const transformedPosts = postMetadata.reduce((acc, [key, metadata]: any[]) => {
            if (key === 'Published') {
                return {
                    ...acc,
                    published: metadata[0][1][0][1].start_date
                };
            }

            if (simpleTransformingKeys.includes(key)) {
                return {
                    ...acc,
                    [key.toLowerCase()]: metadata[0][0]
                };
            }

            if (stringArrayTransformingKeys.includes(key)) {
                // const metadataKey = key.toLowerCase() as keyof typeof metadataOptions;
                // console.log(key, metadata);

                // // concat all the options from all the posts and remove duplicates
                // metadataOptions[metadataKey] = [
                //     ...new Set([...metadataOptions[metadataKey], ...metadata[0][0].split(',')])
                // ];

                return {
                    ...acc,
                    [key.toLowerCase()]: metadata[0][0].split(',')
                };
            }

            return acc;
        }, {} as any);

        transformedPosts.image = {
            src: p.value.format?.page_cover || null,
            position: p.value.format?.page_cover_position || null
        };

        return transformedPosts;
    });

    return { posts, categories: metadataOptions.categories, tags: metadataOptions.tags };
};
