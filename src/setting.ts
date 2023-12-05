import express, { Request, Response, json } from 'express';

export const app = express();

app.use(json());

const resolutions = [
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160',
];

type VideoDB = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: typeof resolutions;
};

type RequestWithParams<T> = Request<T, {}, {}, {}, {}>;
type RequestWithBody<T> = Request<{}, {}, T, {}, {}>;

type CreateVideo = {
  title: string;
  author: string;
  availableResolutions: typeof resolutions;
};

type ErrorMessage = {
  message: string;
  field: string;
};

type Error = {
  errorMessages: ErrorMessage[];
};

const videos: VideoDB[] = [
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
