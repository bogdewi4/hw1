import { VideoDB } from '../model';

let videos: VideoDB[] = [];

const replaceVideos = (mutatedVideos: VideoDB[]) => {
  videos = [...mutatedVideos];
};

export const getVideos = () => {
  return [...videos];
};

export const getVideoById = (id: number) => {
  return videos.find((video) => video.id === id);
};

export const setVideo = (video: VideoDB) => {
  return videos.push(video);
};

export const updateVideoById = (videoId: number, video: Partial<VideoDB>) => {
  let isMutated = false;
  const mutatedVideos = videos.map((v) => {
    if (v.id === videoId) {
      isMutated = true;
      return { ...v, ...video };
    }
    return v;
  });

  if (isMutated) {
    videos = mutatedVideos;
  }

  return isMutated;
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
