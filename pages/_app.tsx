// global styles shared across the entire site
import { MantineProvider } from '@mantine/core';

import { bootstrap } from '@/lib/bootstrap-client';
import { isServer } from '@/lib/config';

// used for rendering equations (optional)
import 'katex/dist/katex.min.css';
// eslint-disable-next-line import/order
import type { AppProps } from 'next/app';

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css';
// eslint-disable-next-line import/order
import * as React from 'react';
// core styles shared by all of react-notion-x (required)
import 'renderer/styles.css';
import 'styles/global.css';
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import 'styles/notion.css';
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css';

if (!isServer) {
    bootstrap();
}

const App = ({ Component, pageProps }: AppProps) => (
    <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
            /** Put your mantine theme override here */
            colorScheme: 'light'
        }}
    >
        <Component {...pageProps} />
    </MantineProvider>
);

export default App;
