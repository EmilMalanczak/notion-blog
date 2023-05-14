import React from 'react';

import { Checkbox as DefaultCheckbox } from './components/checkbox';
import { NotionComponents } from './types';

// eslint-disable-next-line jsx-a11y/anchor-has-content
const DefaultLink: React.FC = (props) => <a target="_blank" rel="noopener noreferrer" {...props} />;
const DefaultLinkMemo = React.memo(DefaultLink);
// eslint-disable-next-line jsx-a11y/anchor-has-content
const DefaultPageLink: React.FC = (props) => <a {...props} />;
const DefaultPageLinkMemo = React.memo(DefaultPageLink);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dummyLink = ({ href, rel, target, title, ...rest }: any) => <span {...rest} />;

const dummyComponent = (name: string) => () => {
    console.warn(`Warning: using empty component "${name}" (you should override this in NotionRenderer.components)`);

    return null;
};

const DefaultEmbed = () => dummyComponent('Asset wrapper');
// const DefaultEmbed = (props: any) => <AssetWrapper {...props} />;

const DefaultHeader = dummyComponent('Header');

// TODO: should we use React.memo here?
// https://reactjs.org/docs/react-api.html#reactmemo
const dummyOverrideFn = (_: any, defaultValueFn: () => React.ReactNode) => defaultValueFn();

export const defaultComponents: NotionComponents = {
    Image: null, // disable custom images by default
    Link: DefaultLinkMemo,
    PageLink: DefaultPageLinkMemo,
    Checkbox: DefaultCheckbox,
    Callout: undefined, // use the built-in callout rendering by default

    Code: dummyComponent('Code'),
    Equation: dummyComponent('Equation'),

    Collection: dummyComponent('Collection'),
    Property: undefined, // use the built-in property rendering by default

    propertyTextValue: dummyOverrideFn,
    propertySelectValue: dummyOverrideFn,
    propertyRelationValue: dummyOverrideFn,
    propertyFormulaValue: dummyOverrideFn,
    propertyTitleValue: dummyOverrideFn,
    propertyPersonValue: dummyOverrideFn,
    propertyFileValue: dummyOverrideFn,
    propertyCheckboxValue: dummyOverrideFn,
    propertyUrlValue: dummyOverrideFn,
    propertyEmailValue: dummyOverrideFn,
    propertyPhoneNumberValue: dummyOverrideFn,
    propertyNumberValue: dummyOverrideFn,
    propertyLastEditedTimeValue: dummyOverrideFn,
    propertyCreatedTimeValue: dummyOverrideFn,
    propertyDateValue: dummyOverrideFn,

    Pdf: dummyComponent('Pdf'),
    Tweet: dummyComponent('Tweet'),
    Modal: dummyComponent('Modal'),

    Header: DefaultHeader,
    Embed: DefaultEmbed
};
