import mem from 'mem';
import normalizeUrlImpl from 'normalize-url';

export const normalizeUrl = mem((url?: string) => {
    let normalizedUrl = url;

    if (!normalizedUrl) {
        return '';
    }

    try {
        if (normalizedUrl.startsWith('https://www.notion.so/image/')) {
            const u = new URL(normalizedUrl);
            const subUrl = decodeURIComponent(u.pathname.substr('/image/'.length));
            const normalizedSubUrl = normalizeUrl(subUrl);
            u.pathname = `/image/${encodeURIComponent(normalizedSubUrl)}`;
            normalizedUrl = u.toString();
        }

        return normalizeUrlImpl(normalizedUrl, {
            stripProtocol: true,
            stripWWW: true,
            stripHash: true,
            stripTextFragment: true,
            removeQueryParameters: true
        });
    } catch (err) {
        return '';
    }
});
