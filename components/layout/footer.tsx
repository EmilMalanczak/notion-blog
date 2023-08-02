import { createStyles, Container, Group, ActionIcon, rem, Text, Footer as MFooter, Button, Title } from '@mantine/core';
import Link from 'next/link';
import { IoLogoLinkedin } from 'react-icons/io5';

import { FOOTER_HEIGHT } from '@/constants';

import { UWRlogo } from '../uwr-logo';

const useStyles = createStyles((theme) => ({
    footer: {
        borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        backgroundColor: '#fff'
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column'
        }
    },

    links: {
        [theme.fn.smallerThan('xs')]: {
            marginTop: theme.spacing.md
        }
    }
}));

export const Footer = () => {
    const { classes } = useStyles();

    return (
        <>
            <div className={classes.footer}>
                <Container className={classes.inner}>
                    <Group align="flex-start" spacing={32}>
                        <div>
                            <Title mb={8} size="xs" order={4}>
                                Adres
                            </Title>

                            <Text weight={400} size="xs" color="dimmed">
                                CCH Legal Construction Cyprian Herl
                                <br />
                                NIP: 9161405020
                                <br />
                                ul. Odrodzenia 19
                                <br />
                                56-300 Milicz
                            </Text>
                        </div>
                        <div>
                            <Title mb={8} size="xs" order={4}>
                                Kontakt
                            </Title>

                            <Text weight={400} size="xs" color="dimmed">
                                Email: herl-cyprian@wp.pl <br />
                                Telefon: +48 722 026 816
                            </Text>
                        </div>
                    </Group>
                </Container>
            </div>
            <MFooter height={FOOTER_HEIGHT} className={classes.footer}>
                <Container className={classes.inner}>
                    <Group>
                        {/* <Image src={logo} alt="" height={60} /> */}
                        <Text weight={400} size="sm" color="dimmed">
                            &copy; 2023 CCH Legal Construction Cyprian Herl
                        </Text>
                    </Group>

                    <Group spacing={0} className={classes.links} position="right" align="center" noWrap>
                        <Link href="https://prawo.uni.wroc.pl/" style={{ height: 36 }}>
                            <Button variant="subtle" color="gray" size="sm">
                                <UWRlogo height="100%" />
                            </Button>
                        </Link>
                        <ActionIcon size="lg">
                            <IoLogoLinkedin size="1.6rem" />
                        </ActionIcon>
                    </Group>
                </Container>
            </MFooter>
        </>
    );
};
