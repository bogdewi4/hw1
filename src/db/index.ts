import { VideoDB } from '../model';

let videos: VideoDB[] = [
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

const replaceVideos = (mutatedVideos: VideoDB[]) => {
  videos = [...mutatedVideos];
};

export const getVideos = () => {
  return [...videos];
};

export const setVideo = (video: VideoDB) => {
  return videos.push(video);
};

export const dropVideoTable = () => {
  videos = [];
};

export const filterVideos = (filterFn: (item: VideoDB) => boolean) => {
  let mutatedVideos: null | VideoDB[] = [] as VideoDB[];
  let isMutated = false;

  getVideos().forEach((video) => {
    if (filterFn(video)) {
      isMutated = true;
      return;
    }
    Array.isArray(mutatedVideos) && mutatedVideos.push(video);
  });

  if (isMutated) {
    replaceVideos(mutatedVideos);
  } else {
    mutatedVideos = null;
  }

  return isMutated;
};
