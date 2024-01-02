import { SortDirection } from '../../types';

type BasePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type CreatePostModel = BasePostModel;
export type UpdatePostModel = BasePostModel;

export type QueryPostInputModel = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
};
