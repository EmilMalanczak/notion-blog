import { FaEnvelopeOpenText } from '@react-icons/all-files/fa/FaEnvelopeOpenText';
import { FaLinkedin } from '@react-icons/all-files/fa/FaLinkedin';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube';
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp';
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline';
import * as React from 'react';

import * as config from '@/lib/config';
import { useDarkMode } from '@/lib/use-dark-mode';

import styles from './styles.module.css';

// TODO: merge the data and icons from PageSocial with the social links in Footer

export const FooterImpl: React.FC = () => {
    const [hasMounted, setHasMounted] = React.useState(false);
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const onToggleDarkMode = React.useCallback(
        (e: any) => {
            e.preventDefault();
            toggleDarkMode();
        },
        [toggleDarkMode]
    );

    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    return (
        <footer className={styles.footer}>
            <div className={styles.copyright}>Copyright 2022 {config.author}</div>

            <div className={styles.settings}>
                {hasMounted && (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        className={styles.toggleDarkMode}
                        href="#"
                        role="button"
                        onClick={onToggleDarkMode}
                        title="Toggle dark mode"
                    >
                        {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
                    </a>
                )}
            </div>

            <div className={styles.social}>
                {config.twitter && (
                    <a
                        className={styles.twitter}
                        href={`https://twitter.com/${config.twitter}`}
                        title={`Twitter @${config.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaTwitter />
                    </a>
                )}

                {config.linkedin && (
                    <a
                        className={styles.linkedin}
                        href={`https://www.linkedin.com/in/${config.linkedin}`}
                        title={`LinkedIn ${config.author}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaLinkedin />
                    </a>
                )}

                {config.newsletter && (
                    <a
                        className={styles.newsletter}
                        href={`${config.newsletter}`}
                        title={`Newsletter ${config.author}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaEnvelopeOpenText />
                    </a>
                )}

                {config.youtube && (
                    <a
                        className={styles.youtube}
                        href={`https://www.youtube.com/${config.youtube}`}
                        title={`YouTube ${config.author}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaYoutube />
                    </a>
                )}
            </div>
        </footer>
    );
};

export const Footer = React.memo(FooterImpl);