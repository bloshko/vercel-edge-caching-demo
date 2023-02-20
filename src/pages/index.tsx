import Head from "next/head";
import { Inter } from "@next/font/google";
import { GetServerSideProps } from "next";
import { fetchAllProducts, ProductItem } from "@/lib/contentfulAPI";
import { getOptionsFromContext, notFound } from "@/lib/ssrUtils";
import Link from "next/link";
import { paths } from "@/paths";
import { LoginButton } from "@/components/LoginButton";

const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  productItems: ProductItem[];
  isPreview?: boolean;
}

const Home: React.FC<HomeProps> = ({ productItems, isPreview }) => {
  const getProductUrl = (slug: string) => {
    return `${paths.product}/${slug}${isPreview ? "?preview" : ""}`;
  };

  return (
    <>
      <Head>
        <title>Vercel Edge caching demo</title>
      </Head>
      <section className="product-links-container ">
        <h2>Products</h2>
        {productItems.map(({ slug, title }) => (
          <Link key={slug} href={getProductUrl(slug)}>
            {title}
          </Link>
        ))}
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const { res } = context;
  const { shouldUsePreviewApi } = getOptionsFromContext(context);

  const productItems = await fetchAllProducts(shouldUsePreviewApi);

  if (!productItems) {
    return notFound();
  }

  res.setHeader("Cache-Control", "public, max-age=300");

  return { props: { productItems, isPreview: shouldUsePreviewApi } };
};

export default Home;
