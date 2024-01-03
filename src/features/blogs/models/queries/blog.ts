import { SortDirection } from '../../../../types';

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
