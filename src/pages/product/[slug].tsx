import { Navbar } from "@/components/Navbar";

import { fetchProductBySlug } from "@/lib/contentfulAPI";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  waitForFewSeconds,
  redirectTo,
  notFound,
  getOptionsFromContext,
  getSaleorProductWithContentfulProductField,
} from "@/lib/ssrUtils";
import { paths } from "@/paths";
import { useRouter } from "next/router";

interface ProductPageProps {
  title: string;
  description: string;
  imageUrl: string;
  ssrDate: string;
}

const ProductPage: NextPage<ProductPageProps> = ({
  title,
  description,
  imageUrl,
  ssrDate,
}) => {
  const { isPreview } = useRouter();
  const pageHeader = isPreview ? "Preview" : "Published";

  return (
    <>
      <Head>
        <title>Vercel Edge caching demo</title>
      </Head>
      <Navbar />
      <header>
        <h1>{pageHeader}</h1>
        <small>SSR date - {ssrDate}</small>
      </header>
      <hr />
      <main>
        <figure>
          <Image
            src={imageUrl}
            height={2048}
            width={1379}
            alt="product image"
            sizes="100vw"
          />
        </figure>
        <section>
          <h2>{title}</h2>
          <p>{description}</p>
        </section>
      </main>
    </>
  );
};

type Params = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<
  ProductPageProps,
  Params
> = async (context) => {
  const { res, params } = context;

  const slug = params?.slug;

  if (!slug) {
    return redirectTo(paths.home);
  }

  const { shouldUsePreviewApi, hasToWait } = getOptionsFromContext(context);

  if (hasToWait) {
    await waitForFewSeconds();
  }

  const contentfulProduct = await fetchProductBySlug(slug, shouldUsePreviewApi);

  if (!contentfulProduct) {
    return notFound();
  }

  const {
    title,
    productImage: { url: imageUrl },
    description,
    product,
  } = contentfulProduct;

  const associatedSaleorProduct = product
    ? await getSaleorProductWithContentfulProductField(product)
    : null;

  const productTitle = associatedSaleorProduct?.name || title;
  const productImageUrl = associatedSaleorProduct?.imageUrl || imageUrl;

  res.setHeader("Cache-Control", "public, max-age=300");

  return {
    props: {
      title: productTitle,
      imageUrl: productImageUrl,
      description,
      ssrDate: new Date().toISOString(),
    },
  };
};

export default ProductPage;
