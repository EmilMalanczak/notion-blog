import { Card, Text, Group, createStyles, getStylesRef, rem, Title, Badge } from '@mantine/core';
import Image from 'next/image';

import { Article } from '@/lib/extract-notion-articles';

import { ArticleDateText } from './article-date-text';

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        height: rem(280),
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        minHeight: 'min(40vw, 450px)',

        [`&:hover .${getStylesRef('image')}`]: {
            transform: 'scale(1.03)'
        },

        [theme.fn.smallerThan('sm')]: {
            minHeight: 'min(60vw, 450px)'
        }
    },

    image: {
        ...theme.fn.cover(),
        ref: getStylesRef('image'),
        transition: 'transform 500ms ease',
        objectFit: 'cover'
    },

    overlay: {
        position: 'absolute',
        top: '20%',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 80%)'
    },

    content: {
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 1
    },

    title: {
        color: theme.white,
        marginBottom: rem(5),

        fontFamily: theme.fontFamily,
        fontWeight: 600,
        fontSize: 'clamp(1rem, 1.5vw + 0.5rem, 1.5rem)'
    },

    bodyText: {
        color: theme.colors.dark[2],
        marginLeft: rem(7)
    },

    description: {
        color: theme.colors.dark[2],
        fontSize: 'clamp(0.75rem, 0.9vw + 0.5rem, 1rem)'
    }
}));

type ArticleCardPrimaryProps = {
    article: Article;
};

export const ArticleCardPrimary = ({ article }: ArticleCardPrimaryProps) => {
    const { classes } = useStyles();

    return (
        <Card p="lg" shadow="lg" className={classes.card} radius="md" component="a" href={`/artykul/${article.id}`}>
            {/* <div className={classes.image} style={{ backgroundImage: `url(${image})` }} /> */}
            {article.image.src ? <Image className={classes.image} src={article.image.src} alt="" fill /> : null}
            <div className={classes.overlay} />

            <div className={classes.content}>
                <ArticleDateText date={article.published} contrast />

                <Title order={3} className={classes.title} my={5}>
                    {article.name}
                </Title>

                <Text size="sm" className={classes.description}>
                    {article.description}
                </Text>

                <Group noWrap mt={8}>
                    {article.categories?.map((tag) => (
                        <Badge key={tag} color="gray" variant="outline" radius="sm">
                            {tag}
                        </Badge>
                    ))}
                </Group>
            </div>
        </Card>
    );
};
