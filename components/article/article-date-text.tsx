import { Text } from '@mantine/core';
import { useMemo } from 'react';

import { formatArticleDate } from 'utils/format-article-date';

type Props = {
    date: string;
    contrast?: boolean;
};

export const ArticleDateText = ({ date, contrast }: Props) => {
    const publishDate = useMemo(() => formatArticleDate(date), [date]);

    return (
        <Text color={contrast ? 'gray.5' : 'dimmed'} size="xs" transform="uppercase" weight={700} mt="md">
            {publishDate}
        </Text>
    );
};
