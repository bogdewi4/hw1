import type { Request } from 'express';
import { ValueOf } from './utils';

export type RequestWithParams<P> = Request<P, {}, {}, {}, {}>;
export type RequestWithBody<B, P = {}> = Request<P, {}, B, {}, {}>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;

export const SortDir = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortDirection = ValueOf<typeof SortDir>;

export type DataWithPagination<D = any> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: D;
};
