import { createGetInitialProps } from '@mantine/next';
import { IconContext } from '@react-icons/all-files';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import * as React from 'react';

const getInitialProps = createGetInitialProps();

export default class MyDocument extends Document {
    static getInitialProps = getInitialProps;

    render() {
        return (
            <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                <Html lang="en">
                    <Head>
                        <link rel="shortcut icon" href="/favicon.ico" />
                        <link rel="icon" type="image/png" sizes="32x32" href="favicon.png" />

                        <link rel="manifest" href="/manifest.json" />
                    </Head>

                    <body>
                        <Main />

                        <NextScript />
                    </body>
                </Html>
            </IconContext.Provider>
        );
    }
}
