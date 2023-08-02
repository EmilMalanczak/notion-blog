import { ExtendedRecordMap, SelectOption } from './types';

export type Article = {
    categories: string[];
    description: string;
    image: { src: null | string; position: null | number };
    name: string;
    published: string;
    tags: string[];
    id: string;
    author: string;
    kioTekst: string;
    kio: string;
    kioSignature?: string;
};

export type ExtractedArticlesData = {
    articles: Article[];
    categories: SelectOption[];
    tags: SelectOption[];
};

export const extractNotionArticles = (recordMap: ExtendedRecordMap): ExtractedArticlesData => {
    const rawArticles = Object.values(recordMap.block as ExtendedRecordMap['block']).filter(
        (b) => b.value.type === 'page' && b.value.parent_table === 'collection'
    );
    // console.log({ rawArticles });

    const metadataOptions: Record<string, SelectOption[]> = {
        categories: [],
        tags: []
    };

    const articles = rawArticles.map((p: any) => {
        const simpleTransformingKeys = ['Author', 'Name', 'Description', 'Author', 'KIO'];
        const stringArrayTransformingKeys = ['Tags', 'Categories'];

        const collectionData = recordMap.collection[p.value.parent_id]?.value;

        // replace the non-meaning schema key with its name
        const postMetadata = Object.entries(p.value.properties).map(([key, metadata]) => {
            const data = collectionData?.schema[key];

            const metadataName = data?.name;
            // console.log([metadataName, metadata]);

            if (stringArrayTransformingKeys.includes(metadataName)) {
                metadataOptions[metadataName.toLowerCase() as keyof typeof metadataOptions] = data?.options || [];
            }

            // console.log(key, ...(metadata as any));

            return [metadataName, metadata];
        });

        // get pure data for articles cards to rid of the notion rerenderer on mainpage
        const transformedArticle = postMetadata.reduce((acc, [key, metadata]: any[]) => {
            if (key === 'Published') {
                return {
                    ...acc,
                    published: metadata[0][1][0][1].start_date
                };
            }

            if (key === 'KIO tekst') {
                return {
                    ...acc,
                    kioTekst: metadata[0][0]
                };
            }

            if (key === 'KIO sygnatura') {
                return {
                    ...acc,
                    kioSignature: metadata[0][0]
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
        // console.log(`Article ${p.value.id}`, JSON.stringify(transformedArticle, null, 2));

        return {
            ...transformedArticle,
            id: p.value.id,
            image: {
                src: p.value.format?.page_cover || null,
                position: p.value.format?.page_cover_position || null
            }
        };
    });

    return { articles, categories: metadataOptions.categories, tags: metadataOptions.tags };
};
