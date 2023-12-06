import { Response, Router } from 'express';

import {
  RESOLUTIONS,
  type Error,
  type RequestWithBody,
  type RequestWithParams,
  type CreateVideo,
  type UpdateVideo,
} from '../types';

import {
  getVideos,
  setVideo,
  filterVideos,
  getVideoById,
  updateVideoById,
} from '../db';
import { VideoDB } from '../model';
import { isValidResolutions, isValidString } from '../utils/validation';

export const videoRouter = Router({});

videoRouter.get('/', (_req, res) => {
  res.send(getVideos());
});

videoRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res) => {
  const videoId = +req.params.id;
  const findedVideo = getVideos().find(({ id }) => id === videoId);

  if (!findedVideo) {
    res.sendStatus(404);
    return;
  }

  res.send(findedVideo);
});

videoRouter.post('/', (req: RequestWithBody<CreateVideo>, res: Response) => {
  let error: Error = {
    errorMessages: [],
  };

  let { title, author, availableResolutions } = req.body;

  try {
    if (!isValidString(title, { maxLength: 40 })) {
      error.errorMessages.push({ message: 'Invalid title!', field: 'title' });
    }
    if (!isValidString(author, { maxLength: 20 })) {
      error.errorMessages.push({ message: 'Invalid author!', field: 'author' });
    }
    if (!isValidResolutions(availableResolutions)) {
      error.errorMessages.push({
        message: 'Invalid availableResolutions!',
        field: 'availableResolutions',
      });

      availableResolutions = [];
    }
  } catch (e) {
    console.log({ e });
    // DO SOMETHING WITH ERROR
  }

  if (error.errorMessages.length) {
    res.status(400).send(error);
    return;
  }

  const createdAt = new Date();
  const publicationDate = new Date();

  publicationDate.setDate(createdAt.getDate() + 1);

  const newVideo: VideoDB = {
    id: +new Date(),
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate.toISOString(),
    title,
    author,
    availableResolutions,
  };

  setVideo(newVideo);
  res.status(201).send(newVideo);
});

videoRouter.put(
  '/:id',
  (req: RequestWithBody<UpdateVideo, { id: string }>, res: Response) => {
    let error: Error = {
      errorMessages: [],
    };

    const body = req.body;

    try {
      if (!isValidString(body.title, { maxLength: 40 })) {
        error.errorMessages.push({ message: 'Invalid title!', field: 'title' });
      }
      if (!isValidString(body.author, { maxLength: 20 })) {
        error.errorMessages.push({
          message: 'Invalid author!',
          field: 'author',
        });
      }
      if (!isValidResolutions(body.availableResolutions)) {
        error.errorMessages.push({
          message: 'Invalid availableResolutions!',
          field: 'availableResolutions',
        });

        body.availableResolutions = [];
      }
      if (
        body?.minAgeRestriction &&
        (body?.minAgeRestriction < 1 || body?.minAgeRestriction > 18)
      ) {
        error.errorMessages.push({
          message: 'Invalid minAgeRestriction!',
          field: 'minAgeRestriction',
        });
      }
    } catch (e) {
      console.log({ e });
      // DO SOMETHING WITH ERROR
    }

    if (error.errorMessages.length) {
      res.status(400).send(error);
      return;
    }

    const videoId = +req.params.id;

    const createdAt = new Date();
    const publicationDate = new Date();

    publicationDate.setDate(createdAt.getDate() + 1);

    const isUpdated = updateVideoById(videoId, {
      ...body,
    });

    isUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }
);

videoRouter.delete('/:id', (req: RequestWithParams<{ id: string }>, res) => {
  const videoId = +req.params.id;
  const isVideoDeleted = filterVideos((video) => video.id === videoId);

  if (!isVideoDeleted) {
    res.sendStatus(404);
    return;
  }

  res.sendStatus(204);
});
