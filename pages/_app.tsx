// used for rendering equations (optional)
import 'katex/dist/katex.min.css';
// eslint-disable-next-line import/order
import type { AppProps } from 'next/app';

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css';
// core styles shared by all of react-notion-x (required)
import 'components/renderer/styles.css';
import 'styles/global.css';
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import 'styles/notion.css';
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css';

// global styles shared across the entire site
import { MantineProvider } from '@mantine/core';
import * as React from 'react';

import { vazirmatnFont } from '@/constants';
import { bootstrap } from '@/lib/bootstrap-client';
import { isServer } from '@/lib/config';

if (!isServer) {
    bootstrap();
}

const App = ({ Component, pageProps }: AppProps) => (
    <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
            /** Put your mantine theme override here */
            colorScheme: 'light',
            fontFamily: vazirmatnFont.style.fontFamily,
            colors: {
                brand: [
                    '#AAACD0',
                    '#7B7EB3',
                    '#5A5E97',
                    '#4A4C77',
                    '#3C3E5E',
                    '#31334B',
                    '#28293B',
                    '#1E1E2D',
                    '#161622',
                    '#10101A'
                ]
            },
            components: {
                Container: {
                    defaultProps: {
                        size: '80rem'
                    }
                }
            },
            globalStyles: (theme) => ({
                body: {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                    minHeight: '100vh'
                }
            })
        }}
    >
        <Component {...pageProps} />
    </MantineProvider>
);

export default App;
