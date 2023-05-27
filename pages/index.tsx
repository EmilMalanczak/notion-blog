import * as React from 'react';

import { NotionPage } from '@/components/NotionPage';
import { domain } from '@/lib/config';
import { extractNotionPosts } from '@/lib/extract-notion-posts';
import { groupPostsByMetadata } from '@/lib/group-posts-by-metadata';
import { resolveNotionPage } from '@/lib/resolve-notion-page';

export const getStaticProps = async () => {
    try {
        const props = await resolveNotionPage(domain);
        console.log('PAGE', props);
        // TODO VALIDATION
        // @ts-ignore
        const { recordMap } = props;

        const postsData = extractNotionPosts(recordMap);
        const groupedPosts = groupPostsByMetadata(postsData);

        return { props: { ...props, ...postsData, ...groupedPosts }, revalidate: 10 };
    } catch (err) {
        console.error('page error', domain, err);

        // we don't want to publish the error version of this page, so
        // let next.js know explicitly that incremental SSG failed
        throw err;
    }
};

// const NotionDomainPage = ({ posts }: any) => (
//     <Stack>
//         {posts.map((post: any) => (
//             <Text key={post.name}>{post.name}</Text>
//         ))}
//     </Stack>
// );
const NotionDomainPage = (props: any) => <NotionPage {...props} />;

export default NotionDomainPage;
