import format from 'date-fns/format/index.js';

export function getCollectionGroups(collection: any, collectionView: any, collectionData: any, ...rest: any[]) {
    const elems = collectionView?.format?.collection_groups || [];
    // @ts-ignore
    return elems?.map(({ property, hidden, value: { value, type } }) => {
        const isUncategorizedValue = typeof value === 'undefined';
        const isDateValue = value?.range;
        // TODO: review dates reducers
        // eslint-disable-next-line no-nested-ternary
        const queryLabel = isUncategorizedValue
            ? 'uncategorized'
            : isDateValue
            ? value.range?.start_date || value.range?.end_date
            : value?.value || value;

        const collectionGroup = collectionData[`results:${type}:${queryLabel}`];
        let queryValue = !isUncategorizedValue && (isDateValue || value?.value || value);
        let schema = collection.schema[property];

        // Checkbox boolen value must be Yes||No
        if (type === 'checkbox' && value) {
            queryValue = 'Yes';
        }

        if (isDateValue) {
            schema = {
                type: 'text',
                name: 'text'
            };

            // TODO: review dates format based on value.type ('week'|'month'|'year')
            queryValue = format(new Date(queryLabel), 'MMM d, YYY hh:mm aa');
        }

        return {
            collectionGroup,
            schema,
            value: queryValue || 'No description',
            hidden,
            collection,
            collectionView,
            collectionData,
            blockIds: collectionGroup?.blockIds,
            ...rest
        };
    });
}
