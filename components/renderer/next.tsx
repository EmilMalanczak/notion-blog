import * as React from 'react';
import isEqual from 'react-fast-compare';

export const wrapNextImage = (NextImage: any): React.FC<any> =>
    // eslint-disable-next-line react/display-name
    React.memo(
        ({
            src,
            alt,

            width,
            height,

            className,
            style,

            layout,
            ...rest
        }) => {
            let lay = layout;
            if (!layout) {
                lay = width && height ? 'intrinsic' : 'fill';
            }

            return (
                <NextImage
                    className={className}
                    src={src}
                    alt={alt}
                    width={lay === 'intrinsic' && width}
                    height={lay === 'intrinsic' && height}
                    // objectFit={style?.objectFit}
                    // objectPosition={style?.objectPosition}
                    style={style}
                    // layout={lay}
                    fill={!(width && height)}
                    {...rest}
                />
            );
        },
        isEqual
    );

export const wrapNextLink = (NextLink: any): React.FC<any> =>
    // eslint-disable-next-line react/function-component-definition
    function ReactNotionXNextLink({ href, as, passHref, prefetch, replace, scroll, shallow, locale, ...linkProps }) {
        return (
            <NextLink
                href={href}
                as={as}
                passHref={passHref}
                prefetch={prefetch}
                replace={replace}
                scroll={scroll}
                shallow={shallow}
                locale={locale}
            >
                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                <a {...linkProps} />
            </NextLink>
        );
    };
