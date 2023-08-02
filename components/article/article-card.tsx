import { AspectRatio, Badge, Card, Group, Text, Title, createStyles } from '@mantine/core';
import Image from 'next/image';

import { Article } from '@/lib/extract-notion-articles';

import { ArticleDateText } from './article-date-text';

const useStyles = createStyles((theme) => ({
    card: {
        transition: 'transform 150ms ease, box-shadow 150ms ease',

        '&:hover': {
            transform: 'scale(1.01)',
            boxShadow: theme.shadows.md
        }
    },

    title: {
        fontFamily: theme.fontFamily,
        fontWeight: 600,
        fontSize: 'clamp(1rem, 1.25vw + 0.5rem, 1.25rem)'
    },

    imageWrapper: {
        position: 'relative'
    },

    description: {
        color: theme.colors.dark[2],
        fontWeight: 500,
        fontSize: 'clamp(0.75rem, 0.75vw + 0.5rem, 0.875rem)'
    }
}));

type ArticleProps = {
    article: Article;
};

export const ArticleCard = ({ article }: ArticleProps) => {
    const { classes } = useStyles();

    return (
        <Card
            key={article.id}
            p="md"
            radius="md"
            component="a"
            href={`/artykul/${article.id}`}
            className={classes.card}
        >
            <Card.Section>
                {article.image.src ? (
                    <AspectRatio ratio={1920 / 1080} className={classes.imageWrapper}>
                        <Image src={article.image.src} alt="" fill />
                    </AspectRatio>
                ) : null}
            </Card.Section>
            <ArticleDateText date={article.published} />
            {/* <Text color="dimmed" size="xs" transform="uppercase" weight={700} mt="md">
                {publishDate}
            </Text> */}

            <Title order={3} className={classes.title} my={5}>
                {article.name}
            </Title>

            <Text className={classes.description} my={5} lineClamp={2}>
                {article.description}
            </Text>
            <Group mt={8} spacing={8}>
                {article.kioSignature && (
                    <Badge color="indigo" variant="light" radius="sm">
                        {article.kioSignature}
                    </Badge>
                )}
                {article.tags?.map((tag) => (
                    <Badge key={tag} color="indigo" variant="light" radius="sm">
                        {tag}
                    </Badge>
                ))}
            </Group>
        </Card>
    );
};
