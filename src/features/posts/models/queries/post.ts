import { SortDirection } from '../../../../types';

export type QueryPostInputModel = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
};
