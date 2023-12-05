import { Response, Router } from 'express';
import {
  CreateVideo,
  Error,
  RequestWithBody,
  RequestWithParams,
  VideoDB,
  resolutions,
  videos,
} from '../setting';

export const videoRouter = Router({});

videoRouter.get('/', (_req, res) => {
  res.send(videos);
});

videoRouter.get('/', (_req, res) => {
  res.send(videos);
});

videoRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res) => {
  const videoId = +req.params.id;

  const findedVideo = videos.find(({ id }) => id === videoId);

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

  if (
    !title ||
    typeof title !== 'string' ||
    !title.trim() ||
    title.trim().length > 40
  ) {
    error.errorMessages.push({ message: 'Invalid title!', field: 'title' });
  }
  if (
    !author ||
    typeof author !== 'string' ||
    !author.trim() ||
    author.trim().length > 20
  ) {
    error.errorMessages.push({ message: 'Invalid author!', field: 'author' });
  }

  if (availableResolutions && Array.isArray(availableResolutions)) {
    availableResolutions.forEach((resolution) => {
      !resolutions.includes(resolution) &&
        error.errorMessages.push({
          message: 'Invalid availableResolutions!',
          field: 'availableResolutions',
        });
    });
  } else {
    availableResolutions = [];
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

  videos.push(newVideo);

  res.status(201).send(newVideo);
});
