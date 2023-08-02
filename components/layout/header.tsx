import {
    createStyles,
    Header as MHeader,
    Menu,
    Group,
    Center,
    Burger,
    Container,
    rem,
    ScrollArea
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { BiChevronDown } from 'react-icons/bi';
// import { IoLogoFacebook, IoLogoLinkedin } from 'react-icons/io5';

import { HEADER_HEIGHT } from '@/constants';

import logo from '../../constants/C.png';

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none'
        }
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none'
        }
    },

    link: {
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 8,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
        }
    },

    linkLabel: {
        paddingRight: rem(4)
    }
}));

export const Header = () => {
    const [opened, { toggle }] = useDisclosure(false);
    const { classes, cx } = useStyles();

    const links: { link: string; label: string; links?: { link: string; label: string }[] }[] = [
        {
            link: '/',
            label: 'Strona główna'
        },
        {
            link: '/artykuly',
            label: 'Artykuły'
        },
        {
            link: '/orzecznictwo',
            label: 'Orzecznictwo'
        },
        {
            link: '/kategorie',
            label: 'Kategorie'
            // links: tags.map((tag) => ({
            //     link: `/kategoria/${tag.id}}`,
            //     label: tag.value
            // }))
        },
        {
            link: '/o-mnie',
            label: 'O mnie'
        },
        {
            link: '/kontakt',
            label: 'Kontakt'
        }
    ];

    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item style={{ minWidth: 160 }} key={item.link}>
                {item.label}
            </Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="click" transitionProps={{ exitDuration: 0 }} withinPortal zIndex={106}>
                    <Menu.Target>
                        <Center>
                            <span className={cx(classes.link, classes.linkLabel)}>
                                {link.label}
                                <BiChevronDown size="0.9rem" style={{ marginLeft: '4px' }} />
                            </span>
                        </Center>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <ScrollArea.Autosize mah={300}>{menuItems}</ScrollArea.Autosize>
                    </Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link key={link.label} href={link.link} className={classes.link}>
                {link.label}
            </Link>
        );
    });

    return (
        <MHeader height={HEADER_HEIGHT} py={8} zIndex={105} style={{ position: 'sticky' }}>
            <Container className={classes.inner}>
                <Link href="/">
                    <Image src={logo} alt="" height={92} />
                </Link>
                <Group spacing={5} className={classes.links}>
                    {items}
                </Group>
                <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
            </Container>
        </MHeader>
    );
};
