import { VERCEL_NO_CACHE_COOKIE_NAME } from "@/config";
import { GetServerSidePropsContext, Redirect } from "next";
import { fetchProductById, fetchProductBySku } from "./saleorApi";

const SALEOR_VARIANT_SKU_PREFIX = "Variant SKU: ";
const SALEOR_PRODUCT_ID_PREFIX = "Product ID: ";

export const waitForFewSeconds = async () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 3000);
  });

type RedirectTo = (path: string) => { redirect: Redirect };

export const redirectTo: RedirectTo = (path) => ({
  redirect: {
    destination: path,
    permanent: false,
  },
});

export const notFound = () =>
  ({
    notFound: true,
  } as const);

export const getOptionsFromContext = ({
  query,
  preview,
}: GetServerSidePropsContext) => {
  const isVercelPreviewMode = !!preview;
  const shouldUsePreviewApi = isVercelPreviewMode;

  const hasToWait = "wait" in query;

  return {
    isAuthorized: true,
    doesRequestPreview: isVercelPreviewMode,
    shouldUsePreviewApi,
    hasToWait,
  } as const;
};

const reformatSaleorVariantSku = (variantSku: string) =>
  variantSku.replace(SALEOR_VARIANT_SKU_PREFIX, "");

const reformatSaleorProductId = (productId: string) =>
  productId.replace(SALEOR_PRODUCT_ID_PREFIX, "");

const isProductId = (contentfulProductField: string) =>
  contentfulProductField.includes(SALEOR_PRODUCT_ID_PREFIX);

const isVariantSku = (contentfulProductField: string) =>
  contentfulProductField.includes(SALEOR_VARIANT_SKU_PREFIX);

type AssociatedSaleorProduct = {
  name: string;
  imageUrl?: string;
};

type GetSaleorProduct = (
  contentfulProductField: string
) => Promise<AssociatedSaleorProduct | null>;

export const getSaleorProductWithContentfulProductField: GetSaleorProduct =
  async (contentfulProductField) => {
    if (isVariantSku(contentfulProductField)) {
      const productSku = reformatSaleorVariantSku(contentfulProductField);
      const saleorProduct = await fetchProductBySku(productSku);
      if (!saleorProduct) {
        return null;
      }

      const { name, media } = saleorProduct;
      const imageUrl = media?.[0]?.url;

      return { name, imageUrl };
    }

    if (isProductId(contentfulProductField)) {
      const productId = reformatSaleorProductId(contentfulProductField);
      const saleorProduct = await fetchProductById(productId);

      if (!saleorProduct) {
        return null;
      }

      const { name, media } = saleorProduct;
      const imageUrl = media?.[0]?.url;

      return { name, imageUrl };
    }

    return null;
  };

export const getVercelNoCacheCookieAddValue = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const secure = isDevelopment ? "" : "Secure;";

  const vercelNoCacheCookie = `${VERCEL_NO_CACHE_COOKIE_NAME}=1; path=/; Max-Age=3600; ${secure} SameSite=Lax;`;

  return vercelNoCacheCookie;
};

export const getVercelNoCacheCookieDeleteValue = () => {
  const maxAgeZeroAttribute = "Max-Age=0";

  const expiredVercelNoCacheCookie = `${VERCEL_NO_CACHE_COOKIE_NAME}=; path=/; SameSite=Strict; ${maxAgeZeroAttribute}`;

  return expiredVercelNoCacheCookie;
};
