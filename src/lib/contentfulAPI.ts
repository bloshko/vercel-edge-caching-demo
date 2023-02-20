import {
  CONTENTFUL_API_ACCESS_TOKEN,
  CONTENTFUL_PREVIEW_API_ACCESS_TOKEN,
  CONTENTFUL_SPACE,
} from "@/config";

export const fetchFromContentful = async (query: string, preview = false) => {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          preview
            ? CONTENTFUL_PREVIEW_API_ACCESS_TOKEN
            : CONTENTFUL_API_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json());
};

type FetchReturn<T> = Promise<T | undefined>;

type Product = {
  title: string;
  description: string;
  productImage: {
    url: string;
  };
  product: string | null;
};

type FetchProductBySlug = (
  slug: string,
  isPreview?: boolean
) => FetchReturn<Product>;

export const fetchProductBySlug: FetchProductBySlug = async (
  slug,
  isPreview?: boolean
) => {
  const previewArgument = isPreview ? "true" : "false";

  const query = `
    query {
      productCollection(where: { slug: "${slug}" }, limit: 1, preview: ${previewArgument}) {
       items{
          productImage {
            url
          }
          title
          description
          product
        }
      }
    }
  `;

  const response = await fetchFromContentful(query, isPreview);

  return response?.data?.productCollection?.items?.[0] as Product | undefined;
};

export type ProductItem = { slug: string; title: string };

type FetchAllProducts = (isPreview?: boolean) => FetchReturn<ProductItem[]>;

export const fetchAllProducts: FetchAllProducts = async (isPreview) => {
  const previewArgument = isPreview ? "true" : "false";

  const query = `
    query {
      productCollection(order: sys_publishedAt_ASC, preview: ${previewArgument}) {
        items {
          slug
          title
        }
      }
    }`;

  const response = await fetchFromContentful(query, isPreview);

  return response?.data?.productCollection?.items as ProductItem[] | undefined;
};

type FetchProductByEntryId = (
  entryId: string,
  isPreview?: boolean
) => FetchReturn<string>;

export const fetchProductSlugByEntryId: FetchProductByEntryId = async (
  entryId,
  isPreview
) => {
  const previewArgument = isPreview ? "true" : "false";

  const query = `
    query {
      product(id: "${entryId}", preview: ${previewArgument}) {
        slug
      }
    }`;

  const response = await fetchFromContentful(query, isPreview);

  return response?.data?.product?.slug as string | undefined;
};
