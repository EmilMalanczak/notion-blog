import { Vazirmatn } from 'next/font/google';

export const HEADER_HEIGHT = 108;
export const FOOTER_HEIGHT = 82;

export const vazirmatnFont = Vazirmatn({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '500', '600', '700'],
    style: ['normal'],
    preload: true
});
