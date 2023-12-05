import express, { Response, json } from 'express';
import {
  CreateVideo,
  Error,
  RequestWithBody,
  RequestWithParams,
  VideoDB,
  resolutions,
  videos,
} from './setting';

export const app = express();

app.use(json());

const PORT = 5000;

app.get('/videos', (_req, res) => {
  res.send(videos);
});

app.get('/videos/:id', (req: RequestWithParams<{ id: string }>, res) => {
  const videoId = +req.params.id;

  const findedVideo = videos.find(({ id }) => id === videoId);

  if (!findedVideo) {
    res.sendStatus(404);
    return;
  }

  res.send(findedVideo);
});

app.post('/videos', (req: RequestWithBody<CreateVideo>, res: Response) => {
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

app.listen(PORT, () => {
  console.log(`App start on port: ${PORT}`);
});
