import { apiSlice } from "./base-query";
import { Product } from "@/types/admin/product"; 
import { ProductCategory } from "@/types/master/product-category"; 

export const productCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryList: builder.query<
      {
        data: ProductCategory[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number;}
    >({
      query: ({ page, paginate }) => ({
        url: `/public/product-categories?paginate=10&page=1&is_parent=1`,
        method: "GET",
        params: {
          page,
          paginate,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: ProductCategory[];
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),
    
    // 🔍 Get All Product Categories (with pagination)
    getProductList: builder.query<
      {
        data: Product[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; product_merk_id?: number | null }
    >({
      query: ({ page, paginate, product_merk_id }) => ({
        url: `/public/products`,
        method: "GET",
        params: {
          page,
          paginate,
          product_merk_id
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Product[];
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // 🔍 Get Product Category by Slug
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => ({
        url: `/public/products/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Product;
      }) => response.data,
    }),

    getProductVariantBySlug: builder.query<Product, string>({
      query: (slug) => ({
        url: `/shop/products/${slug}/variants`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Product;
      }) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoryListQuery,
  useGetProductListQuery,
  useGetProductBySlugQuery,
  useGetProductVariantBySlugQuery,
} = productCategoryApi;