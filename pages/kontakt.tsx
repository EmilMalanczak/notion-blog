/* eslint-disable jsx-a11y/label-has-associated-control */
import emailjs from '@emailjs/browser';
import { Button, Text, Group, Stack, TextInput, Textarea, Title } from '@mantine/core';
import { FormEvent, useRef, useState } from 'react';

import { Layout } from '@/components/layout/layout';
import { domain } from '@/lib/config';
import { ExtractedArticlesData, extractNotionArticles } from '@/lib/extract-notion-articles';
import { GroupedArticles } from '@/lib/group-posts-by-metadata';
import { resolveNotionPage } from '@/lib/resolve-notion-page';

export const getStaticProps = async () => {
    try {
        const props = await resolveNotionPage(domain);

        // TODO VALIDATION
        // @ts-ignore
        const { recordMap } = props;

        const articlesData = extractNotionArticles(recordMap);

        return { props: { ...props, ...articlesData }, revalidate: 10 };
    } catch (err) {
        console.error('page error', domain, err);

        // we don't want to publish the error version of this page, so
        // let next.js know explicitly that incremental SSG failed
        throw err;
    }
};

const NotionDomainPage = ({ categories, tags }: ExtractedArticlesData & GroupedArticles) => {
    const form = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'init' | 'error' | 'success' | 'loading'>('init');

    const sendEmail = (e: FormEvent) => {
        e.preventDefault();

        setStatus('loading');
        // @ts-ignore
        emailjs.sendForm('service_sf9ue58', 'template_87jccjc', form.current, 'JOVm6-8wPuIIsYjr_').then(
            () => {
                setStatus('success');
            },
            (error) => {
                alert(error.text);
                setStatus('error');
            }
        );
    };

    return (
        <Layout categories={categories} tags={tags}>
            <Group align="flex-start" w="100%" grow maw={800} mx="auto" mt={32}>
                <Stack spacing={32}>
                    <div>
                        <Title mb={8} size="xs" order={4}>
                            Adres
                        </Title>

                        <Text weight={400} size="xs" color="dimmed">
                            CCH Legal Construction Cyprian Herl
                            <br />
                            NIP: 9161405020
                            <br />
                            ul. Odrodzenia 19
                            <br />
                            56-300 Milicz
                        </Text>
                    </div>
                    <div>
                        <Title mb={8} size="xs" order={4}>
                            Kontakt
                        </Title>

                        <Text weight={400} size="xs" color="dimmed">
                            Email: herl-cyprian@wp.pl <br />
                            Telefon: +48 722 026 816
                        </Text>
                    </div>
                </Stack>

                <form ref={form} onSubmit={sendEmail}>
                    <TextInput label="Imię" placeholder="Wpisz imię" type="text" name="name" mt={8} />
                    <TextInput label="Email" type="email" placeholder="Wpisz adres email" name="email" mt={8} />
                    <Textarea
                        minRows={5}
                        maxRows={10}
                        label="Wiadomość"
                        name="message"
                        mt={8}
                        placeholder="Wpisz treść wiadomości"
                        autosize
                    />

                    <Button mt={8} type="submit" disabled={status === 'loading'} loading={status === 'loading'}>
                        Send
                    </Button>
                </form>
            </Group>
        </Layout>
    );
};

export default NotionDomainPage;
