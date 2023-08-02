import { Text, ScrollArea, rem, createStyles } from '@mantine/core';
import throttle from 'lodash.throttle';
import { TableOfContentsEntry, uuidToId } from 'notion-utils';
import * as React from 'react';
import { IoMdList } from 'react-icons/io';

import { HEADER_HEIGHT } from '@/constants';

const useStyles = createStyles((theme) => ({
    wrapper: {
        boxSizing: 'border-box',
        paddingLeft: theme.spacing.md,
        position: 'sticky',
        // top: theme.spacing.xl,
        right: 0,
        paddingTop: 0,
        // flex: `0 0 ${rem(260)}`,
        // top: rem(HEADER_HEIGHT + theme.spacing.xl),
        top: rem(HEADER_HEIGHT + 32),
        zIndex: 101,

        alignSelf: 'flex-start',
        flex: 1,

        [theme.fn.smallerThan('md')]: {
            display: 'none'
        }
    },

    inner: {
        paddingTop: 0,
        paddingBottom: theme.spacing.xl,
        paddingLeft: theme.spacing.md,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    items: {
        borderLeft: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`
    },

    link: {
        display: 'block',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        borderLeft: `${rem(1)} solid transparent`,
        padding: `${rem(8)} ${theme.spacing.md}`,
        marginLeft: -1
    },

    linkActive: {
        borderLeftColor: theme.colors.blue[5],
        backgroundColor:
            theme.colorScheme === 'dark' ? theme.fn.rgba(theme.colors.blue[9], 0.45) : theme.colors.blue[0],
        color: theme.colorScheme === 'dark' ? theme.colors.blue[1] : theme.colors.blue[8]
    },

    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing.md
    },

    title: {
        marginLeft: theme.spacing.md
    }
}));

export const PageAside: React.FC<{
    toc: Array<TableOfContentsEntry>;

    hasToc: boolean;
    hasAside: boolean;
    pageAside?: React.ReactNode;
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ toc, pageAside, hasToc, hasAside, className }) => {
    const [activeSection, setActiveSection] = React.useState<string | null>(null);
    const { classes, cx } = useStyles();

    const throttleMs = 100;
    const actionSectionScrollSpy = React.useMemo(
        () =>
            throttle(() => {
                const sections = document.getElementsByClassName('notion-h');

                // @ts-ignore
                let prevBBox: DOMRect = null;
                let currentSectionId = activeSection;

                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < sections.length; ++i) {
                    const section = sections[i];
                    // eslint-disable-next-line no-continue
                    if (!section || !(section instanceof Element)) continue;

                    if (!currentSectionId) {
                        currentSectionId = section.getAttribute('data-id');
                    }

                    const bbox = section.getBoundingClientRect();
                    const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0;
                    const offset = Math.max(150, prevHeight / 4);

                    // GetBoundingClientRect returns values relative to the viewport
                    if (bbox.top - offset < 0) {
                        currentSectionId = section.getAttribute('data-id');

                        prevBBox = bbox;
                        // eslint-disable-next-line no-continue
                        continue;
                    }

                    // No need to continue loop, if last element has been detected
                    break;
                }

                setActiveSection(currentSectionId);
            }, throttleMs),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            // explicitly not taking a dependency on activeSection
            setActiveSection
        ]
    );

    React.useEffect(() => {
        if (!hasToc) {
            return;
        }

        window.addEventListener('scroll', actionSectionScrollSpy);

        actionSectionScrollSpy();

        // eslint-disable-next-line consistent-return
        return () => {
            window.removeEventListener('scroll', actionSectionScrollSpy);
        };
    }, [hasToc, actionSectionScrollSpy]);

    if (!hasAside) {
        return null;
    }

    return (
        <nav className={classes.wrapper}>
            <div className={classes.inner}>
                <div className={classes.header}>
                    <IoMdList size={20} />
                    <Text inline mt={2} className={classes.title}>
                        Table of contents
                    </Text>
                </div>
                <ScrollArea.Autosize mah={`calc(100vh - ${rem(140)})`} type="scroll" offsetScrollbars>
                    <div className={classes.items}>
                        {toc.map((tocItem) => {
                            const id = uuidToId(tocItem.id);

                            return (
                                <Text<'a'>
                                    href={`#${id}`}
                                    key={id}
                                    size="sm"
                                    component="a"
                                    className={cx(classes.link, {
                                        [classes.linkActive]: activeSection === id
                                    })}
                                    sx={(theme) => ({
                                        paddingLeft: `calc(${tocItem.indentLevel + 1} * ${theme.spacing.md})`
                                    })}
                                >
                                    {tocItem.text}
                                </Text>
                            );
                        })}
                    </div>
                </ScrollArea.Autosize>
            </div>
        </nav>
    );
};
