import { SortDirection } from '@/types';

type BaseBlogModel = { name: string; description: string; websiteUrl: string };

export type CreateBlogModel = BaseBlogModel;
export type UpdateBlogModel = BaseBlogModel;
export type CreatePostBlogModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type QueryBlogInputModel = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
};

export type QueryPostByBlogIdInputModel = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
};
