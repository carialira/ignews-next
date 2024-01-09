import { useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { RichText } from "prismic-dom";

import Styles from "../post.module.scss";
import { getPrismicClient } from "@/service/prismic";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface PostPreviewProps {
  post: { slug: string; title: string; content: string; updatedAt: string };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session }: any = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.activeSubscription) {
      router.push(`/posts/${post.slug}`);
      return;
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | IgNews</title>
      </Head>
      <main className={Styles.container}>
        <article className={Styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${Styles.postContent} ${Styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={Styles.continueReading}>
            Wanna continue reading?
            <Link href="" className={Styles.linkTo}>
              Subscribe now ╰(*°▽°*)╯
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      // {
      //   params: { slug: "prince-harry-belongs-to-the-british-royal-family-h" },
      // },
    ],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID("publication", String(slug));
  const post = {
    slug,
    title: response.data.title,
    content: RichText.asHtml(response.data.content.splice(0, 2)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };
  return {
    props: { post },
    redirect: 60 * 30, //1x a cada 30 min
  };
};
