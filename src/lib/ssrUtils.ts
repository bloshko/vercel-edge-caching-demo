import { MOCK_AUTHORIZATION_COOKIE_NAME } from "@/config";
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
  req,
  query,
  preview,
}: GetServerSidePropsContext) => {
  const isMockAuthorizationCookiePresent =
    MOCK_AUTHORIZATION_COOKIE_NAME in req.cookies;

  const shouldUsePreviewApi = isMockAuthorizationCookiePresent && preview;

  const hasToWait = "wait" in query;

  return {
    isAuthorized: isMockAuthorizationCookiePresent,
    doesRequestPreview: !!preview,
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
