import copyToClipboard from 'clipboard-copy';
import { CodeBlock } from 'notion-types';
import { getBlockTitle } from 'notion-utils';
import { highlightElement } from 'prismjs';
import * as React from 'react';
import 'prismjs/components/prism-clike.min.js';
import 'prismjs/components/prism-css-extras.min.js';
import 'prismjs/components/prism-css.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-js-extras.min.js';
import 'prismjs/components/prism-json.min.js';
import 'prismjs/components/prism-jsx.min.js';
import 'prismjs/components/prism-tsx.min.js';
import 'prismjs/components/prism-typescript.min.js';

import { Text } from '../components/text';
import CopyIcon from '../icons/copy';
import { cs } from '../utils';

import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-csharp.js';
import 'prismjs/components/prism-docker.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-js-templates.js';
import 'prismjs/components/prism-coffeescript.js';
import 'prismjs/components/prism-diff.js';
import 'prismjs/components/prism-git.js';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-graphql.js';
import 'prismjs/components/prism-handlebars.js';
import 'prismjs/components/prism-less.js';
import 'prismjs/components/prism-makefile.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-objectivec.js';
import 'prismjs/components/prism-ocaml.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-reason.js';
import 'prismjs/components/prism-rust.js';
import 'prismjs/components/prism-sass.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-solidity.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-stylus.js';
import 'prismjs/components/prism-swift.js';
import 'prismjs/components/prism-wasm.js';
import 'prismjs/components/prism-yaml.js';
import { useNotionContext } from 'renderer/context-root';

export const Code: React.FC<{
    block: CodeBlock;
    defaultLanguage?: string;
    className?: string;
}> = ({ block, defaultLanguage = 'typescript', className }) => {
    const [isCopied, setIsCopied] = React.useState(false);
    const copyTimeout = React.useRef<number>();
    const { recordMap } = useNotionContext();
    const content = getBlockTitle(block, recordMap);
    const language = (block.properties?.language?.[0]?.[0] || defaultLanguage).toLowerCase();
    const { caption } = block.properties;

    const codeRef = React.useRef();
    React.useEffect(() => {
        if (codeRef.current) {
            try {
                highlightElement(codeRef.current);
            } catch (err) {
                console.warn('prismjs highlight error', err);
            }
        }
    }, [codeRef]);

    const onClickCopyToClipboard = React.useCallback(() => {
        copyToClipboard(content);
        setIsCopied(true);

        if (copyTimeout.current) {
            clearTimeout(copyTimeout.current);
            // @ts-ignore
            copyTimeout.current = null;
        }

        copyTimeout.current = setTimeout(() => {
            setIsCopied(false);
        }, 1200) as unknown as number;
    }, [content, copyTimeout]);

    const copyButton = (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className="notion-code-copy-button" onClick={onClickCopyToClipboard}>
            <CopyIcon />
        </div>
    );

    return (
        <>
            <pre className={cs('notion-code', className)}>
                <div className="notion-code-copy">
                    {copyButton}

                    {isCopied && (
                        <div className="notion-code-copy-tooltip">
                            <div>{isCopied ? 'Copied' : 'Copy'}</div>
                        </div>
                    )}
                </div>

                {/* @ts-ignore */}
                <code className={`language-${language}`} ref={codeRef}>
                    {content}
                </code>
            </pre>

            {caption && (
                <figcaption className="notion-asset-caption">
                    <Text value={caption} block={block} />
                </figcaption>
            )}
        </>
    );
};
