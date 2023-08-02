import { Badge, Group, Title, createStyles } from '@mantine/core';
import Link from 'next/link';

import { useLayoutContext } from './layout/layout.context';

const useStyles = createStyles((theme) => ({
    container: {
        backgroundColor: theme.white,
        width: '100%',
        padding: 12,
        marginTop: 8,
        borderRadius: theme.radius.sm
    }
}));

export const TagsList = () => {
    const { tags } = useLayoutContext();
    const { classes } = useStyles();

    return (
        <div className={classes.container}>
            <Title order={3}>Kategorie</Title>
            <Group mt={8} spacing={8}>
                {tags?.map((tag) => (
                    <Link key={tag.id} href={`/artykuly/${tag.id}`}>
                        <Badge color="indigo" variant="light" radius="sm">
                            {tag.value}
                        </Badge>
                    </Link>
                ))}
            </Group>
        </div>
    );
};
