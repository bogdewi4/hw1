import type { Request } from 'express';

export type RequestWithParams<T> = Request<T, {}, {}, {}, {}>;
export type RequestWithBody<T> = Request<{}, {}, T, {}, {}>;
