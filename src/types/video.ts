export const RESOLUTIONS = [
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160',
];

export type CreateVideo = {
  title: string;
  author: string;
  availableResolutions: typeof RESOLUTIONS;
};

export type UpdateVideo = CreateVideo & {
  canBeDownloaded?: boolean;
  minAgeRestriction?: number;
  publicationDate?: string;
};
