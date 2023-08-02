import { Title, Aside as MAside, createStyles, Text } from '@mantine/core';
import Link from 'next/link';

import { Article } from '@/lib/extract-notion-articles';

import { useLayoutContext } from '../layout/layout.context';

const useStyles = createStyles((theme) => ({
    categories: {
        [theme.fn.smallerThan('md')]: {
            display: 'none'
        }
    },

    container: {
        borderRadius: theme.radius.sm,
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },

    tags: {}
}));

export const Aside = ({ kioArticles }: { kioArticles: Article[] }) => {
    const { categories, tags } = useLayoutContext();
    const { classes } = useStyles();
    console.log({
        tags,
        categories
    });

    return (
        <MAside mt={16} p={16} zIndex={100} height="auto" className={classes.container}>
            {/* <div className={classes.categories}>
                <Title order={2}>Kategorie</Title>
                <List spacing={8} mt={4}>
                    {categories.map((category) => (
                        <List.Item key={category.id}>{category.value}</List.Item>
                    ))}
                </List>
            </div> */}

            {/* <div className={classes.tags}>
                <Title order={2}>Tagi</Title>
                <Group spacing={8} mt={4}>
                    {tags.map((tag) => (
                        <Badge radius="sm" size="lg" key={tag.id}>
                            {tag.value}
                        </Badge>
                    ))}
                </Group>
            </div> */}

            <Title order={2}>Orzecznictwo</Title>

            {kioArticles.map((article) => (
                <Text component={Link} href={`/artykul/${article.id}`} key={article.id} mt={8}>
                    <b>{article.kio}</b>
                    <br />
                    <Text italic lineClamp={5} style={{ wordBreak: 'break-all' }}>
                        {article.kioTekst}
                    </Text>
                </Text>
            ))}
        </MAside>
    );
};
