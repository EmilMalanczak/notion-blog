import { Container, createStyles, rem } from '@mantine/core';
import { type ReactNode } from 'react';

import { FOOTER_HEIGHT, HEADER_HEIGHT } from '@/constants';
import { SelectOption } from '@/lib/types';

import { Footer } from './footer';
import { Header } from './header';
import { LayoutProvider } from './layout.context';

type Props = {
    children: ReactNode;
    categories: SelectOption[];
    tags: SelectOption[];
};

const useStyles = createStyles((theme) => ({
    container: {
        minHeight: '100vh',
        backgroundColor: theme.colors.gray[0],
        transition: 'background-color 0.3s ease-in-out',
        width: '100%',
        paddingBottom: rem(120),
        height: '100%'
    },

    main: {
        minHeight: `calc(100vh - ${FOOTER_HEIGHT + HEADER_HEIGHT}px)`,
        position: 'relative'
    },

    background: {
        backgroundImage: `url('https://images.pexels.com/photos/2138126/pexels-photo-2138126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        backgroundSize: 'cover',
        filter: 'brightness(100%) grayscale(100%) contrast(120%)',
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        backgroundPosition: '60% -20%',
        opacity: 0.2,
        backgroundRepeat: 'no-repeat'
    }
}));

export const Layout = ({ children, categories, tags }: Props) => {
    const { classes } = useStyles();

    return (
        <LayoutProvider categories={categories} tags={tags}>
            <Header />
            <main className={classes.main}>
                <Container className={classes.container}>{children}</Container>
                <div className={classes.background} />
            </main>
            <Footer />
        </LayoutProvider>
    );
};
