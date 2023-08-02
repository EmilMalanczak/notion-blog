import { Title, createStyles } from '@mantine/core';

const useStyles = createStyles<string, { contrast: boolean }>((theme, { contrast }) => ({
    title: {
        fontFamily: theme.fontFamily,
        fontWeight: 600,
        fontSize: 'clamp(0.875rem, 1vw + 0.5rem, 1.25rem)',
        color: contrast ? theme.white : theme.colors.brand[6]
    }
}));

type Props = {
    title: string;
    contrast?: boolean;
};

export const ArticleTitle = ({ title, contrast = false }: Props) => {
    const { classes } = useStyles({ contrast });

    return (
        <Title order={3} className={classes.title} my={5}>
            {title}
        </Title>
    );
};
