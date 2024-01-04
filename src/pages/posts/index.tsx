import Head from "next/head";
import * as prismic from '@prismicio/client';

import Styles from "./styles.module.scss";
import { GetStaticProps } from "next";

import { getPrismicClient } from "../../service/prismic";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={Styles.container}>
        <div className={Styles.posts}>
          <a href="#">
            <time>04-01-2023 15:00</time>
            <strong>One Year ago: 2022 health news</strong>
            <p>Many great things happen in medicine in 2022. Here are some of the events. Holograms train medical students. Holograms are...</p>
          </a>
          <a href="#">
            <time>03-01-2024 07:00</time>
            <strong>Russia celebrity party</strong>
            <p>There is a big party in Russia. Famous people...</p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ()=>{
  const cliente = getPrismicClient();
  const document = await cliente.get({
    predicates: prismic.predicate.at('document.type', 'publication'),
    fetch: ['publication.title', 'publication.content'],
    pageSize:100,
  })

  console.log(JSON.stringify(document, null, 2))

  return{
    props: {}
  }

};