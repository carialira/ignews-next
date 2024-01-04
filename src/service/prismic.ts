import * as Prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown){
  const prismic = Prismic.createClient(process.env.PRISMIC_ENDPOINT,{
   accessToken: process.env.PRISMIC_ACCESS_TOKEN
  });
  prismic.enableAutoPreviewsFromReq(req)

  // const prismic = Prismic.client(process.env.PRISMIC_ENDPOINT, {req, accessToken:process.env.PRISMIC_ACCESS_TOKEN})
  return prismic;
}
