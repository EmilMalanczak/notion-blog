/* eslint-disable no-underscore-dangle */
import { Anchor, Breadcrumbs as MBreadcrumbs } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _defaultGetTextGenerator = (param: string, query: any): null | string => null;
const _defaultGetDefaultTextGenerator = (path: string) => path;

// Pulled out the path part breakdown because its
// going to be used by both `asPath` and `pathname`
const generatePathParts = (pathStr: string) => {
    const pathWithoutQuery = pathStr.split('?')[0];
    return pathWithoutQuery.split('/').filter((v) => v.length > 0);
};

const Crumb = ({ text: defaultText, textGenerator, href }: any) => {
    const [text, setText] = useState(defaultText);

    useEffect(() => {
        const setTextAsync = async () => {
            // If `textGenerator` is nonexistent, then don't do anything
            if (!textGenerator) {
                return;
            }
            // Run the text generator and set the text again
            const finalText = await textGenerator();
            setText(finalText);
        };

        setTextAsync();
    }, [textGenerator]);

    // if (last) {
    //     return <Text>{text}</Text>;
    // }

    // All other crumbs will be rendered as links that can be visited
    return <Anchor href={href}>{text}</Anchor>;
};

export const Breadcrumbs = ({
    getTextGenerator = _defaultGetTextGenerator,
    getDefaultTextGenerator = _defaultGetDefaultTextGenerator
}) => {
    const router = useRouter();

    const breadcrumbs = useMemo(() => {
        const asPathNestedRoutes = generatePathParts(router.asPath);
        // const pathnameNestedRoutes = generatePathParts(router.pathname);

        const crumblist = asPathNestedRoutes.map((subpath, idx) => {
            // Pull out and convert "[post_id]" into "post_id"
            // const param = pathnameNestedRoutes[idx].replace('[', '').replace(']', '');

            const href = `/${asPathNestedRoutes.slice(0, idx + 1).join('/')}`;

            return {
                href,
                // textGenerator: getTextGenerator(param, router.query),
                text: getDefaultTextGenerator(subpath)
            };
        });

        return [{ href: '/', text: 'Strona główna' }, ...crumblist];
    }, [router.asPath, router.pathname, router.query, getTextGenerator, getDefaultTextGenerator]);

    return (
        // {/* The old breadcrumb ending with '/>' was converted into this */}
        <div>
            <MBreadcrumbs aria-label="breadcrumb">
                {/*
          Iterate through the crumbs, and render each individually.
          We "mark" the last crumb to not have a link.
        */}
                {breadcrumbs.map((crumb, idx) => (
                    <Crumb {...crumb} last={idx === breadcrumbs.length - 1} key={crumb.href} />
                ))}
            </MBreadcrumbs>
        </div>
    );
};

export default Breadcrumbs;
