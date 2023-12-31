/* eslint-disable react/no-array-index-key */
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp';
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline';
import cs from 'classnames';
import * as types from 'notion-types';
import * as React from 'react';

import { Breadcrumbs, Header, Search } from '@/components/renderer/components/header';
import { useNotionContext } from '@/components/renderer/context-root';
import { isSearchEnabled, navigationLinks, navigationStyle } from '@/lib/config';
import { useDarkMode } from '@/lib/use-dark-mode';

import styles from './styles.module.css';

const ToggleThemeButton = () => {
    const [hasMounted, setHasMounted] = React.useState(false);
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    React.useEffect(() => {
        setHasMounted(true);
    }, []);
    const onToggleTheme = React.useCallback(() => {
        toggleDarkMode();
    }, [toggleDarkMode]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className={cs('breadcrumb', 'button', !hasMounted && styles.hidden)} onClick={onToggleTheme}>
            {hasMounted && isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
        </div>
    );
};

export const NotionPageHeader: React.FC<{
    block: types.CollectionViewPageBlock | types.PageBlock;
}> = ({ block }) => {
    const { components, mapPageUrl } = useNotionContext();

    if (navigationStyle === 'default') {
        return <Header block={block} />;
    }

    return (
        <header className="notion-header">
            <div className="notion-nav-header">
                <Breadcrumbs block={block} rootOnly />

                {navigationLinks
                    ?.map((link, index) => {
                        if (!link?.pageId && !link?.url) {
                            return null;
                        }

                        if (link.pageId) {
                            return (
                                <components.PageLink
                                    href={mapPageUrl(link.pageId)}
                                    key={index}
                                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                                >
                                    {link.title}
                                </components.PageLink>
                            );
                        }
                        return (
                            <components.Link
                                href={link.url}
                                key={index}
                                className={cs(styles.navLink, 'breadcrumb', 'button')}
                            >
                                {link.title}
                            </components.Link>
                        );
                    })
                    .filter(Boolean)}

                <ToggleThemeButton />

                {isSearchEnabled && <Search block={block} title={null} />}
            </div>
        </header>
    );
};
