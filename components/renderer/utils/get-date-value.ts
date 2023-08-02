import * as types from 'notion-types';

/**
 * Attempts to find a valid date from a given property.
 */
export const getDateValue = (prop: any[]): types.FormattedDate | null => {
    if (prop && Array.isArray(prop)) {
        if (prop[0] === 'd') {
            return prop[1];
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const v of prop) {
            const value = getDateValue(v);
            if (value) {
                return value;
            }
        }
    }

    return null;
};
