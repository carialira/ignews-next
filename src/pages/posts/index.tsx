import Head from "next/head";
import { GetStaticProps } from "next";
import * as Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import Styles from "./styles.module.scss";

import { getPrismicClient } from "../../service/prismic";
import Link from "next/link";

type Posts = {
  slug: string;
  title: String;
  excerpt: string;
  updatedAt: string;
};
interface PostsProps {
  posts: Array<Posts>;
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={Styles.container}>
        <div className={Styles.posts}>
          {posts && posts.length>0 && posts.map((post) => {
            return (
              <Link href={`/posts/${post.slug}`} key={post.slug}>
                  <time>{post.updatedAt}</time>
                  <strong>{post.title}</strong>
                  <p>{post.excerpt}</p>
                  </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const cliente = getPrismicClient();
  const response = await cliente.get({
    predicates: Prismic.predicate.at("document.type", "publication"),
    fetch: ["publication.title", "publication.content"],
    pageSize: 100,
  });

  // console.log(JSON.stringify(response, null, 2));

  const posts = response.results.map((post:any) => {
    const resumeText: any = post.data.content.find(
      (content: any) => content.type === "paragraph"
    );
    return {
      slug: post.uid,
      title: post.data.title,
      excerpt: resumeText ? resumeText.text : "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {posts},
  };
};
