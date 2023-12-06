import type { Request } from 'express';

export type RequestWithParams<T> = Request<T, {}, {}, {}, {}>;
export type RequestWithBody<B, P = {}> = Request<P, {}, B, {}, {}>;
