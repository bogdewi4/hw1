import { Request, Response } from 'express';

export const resolutions = [
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160',
];

export type VideoDB = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: typeof resolutions;
};

export type RequestWithParams<T> = Request<T, {}, {}, {}, {}>;
export type RequestWithBody<T> = Request<{}, {}, T, {}, {}>;

export type CreateVideo = {
  title: string;
  author: string;
  availableResolutions: typeof resolutions;
};

export type ErrorMessage = {
  message: string;
  field: string;
};

export type Error = {
  errorMessages: ErrorMessage[];
};

export const videos: VideoDB[] = [
  {
    id: 0,
    title: 'string',
    author: 'string',
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: '2023-12-04T16:26:41.674Z',
    publicationDate: '2023-12-04T16:26:41.674Z',
    availableResolutions: ['P144'],
  },
];
