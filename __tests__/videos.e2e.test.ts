import 'dotenv/config';
import request from 'supertest';

import { app } from '../src/server';

type VideoDB = any;

describe('/videos', () => {
  let newVideo: Partial<VideoDB> | null = {
    id: 1,
    title: 'title',
    availableResolutions: ['P144'],
    author: 'author',
    canBeDownloaded: false,
    createdAt: new Date().toISOString(),
    minAgeRestriction: 10,
    publicationDate: new Date().toISOString(),
  };

  beforeAll(async () => {
    // await client.connect();
    await request(app).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    // await client.close();
  });

  it('GET products = []', async () => {
    await request(app).get('/videos/').expect([]);
  });

  it('- POST does not create the video with incorrect data (no title, no author)', async function () {
    await request(app)
      .post('/videos/')
      .send({ title: '', author: '', availableResolutions: ['P144'] })
      .expect(400, {
        errorsMessages: [
          { message: 'Invalid title!', field: 'title' },
          { message: 'Invalid author!', field: 'author' },
        ],
      });

    const res = await request(app).get('/videos/');

    expect(res.body).toEqual([]);
  });

  it('+ POST create Videp', async function () {
    await request(app)
      .post('/videos/')
      .send({ ...newVideo })
      .expect(201);
  });

  it('- GET product by ID with incorrect id', async () => {
    await request(app).get('/videos/helloWorld').expect(404);
  });
  it('+ GET product by ID with correct id', async () => {
    const res = await request(app).get('/videos/');

    await request(app)
      .get('/videos/' + res.body[0].id)
      .expect(200, res.body[0]);
  });

  it('- PUT product by ID with incorrect data', async () => {
    const res = await request(app).get('/videos/');
    await request(app)
      .put('/videos/' + 123)
      .send({ ...newVideo, canBeDownloaded: true, minAgeRestriction: 15 })
      .expect(404);

    expect(res.body[0]).toEqual({
      ...res.body[0],
    });
  });

  it('+ PUT product by ID with correct data', async () => {
    const response = await request(app).get('/videos/');
    await request(app)
      .put('/videos/' + response.body[0].id)
      .send({
        ...newVideo,
        title: 'hello title',
        author: 'hello author',
        publicationDate: '2023-01-12T08:12:39.261Z',
        canBeDownloaded: true,
        minAgeRestriction: 15,
      })
      .expect(204);

    const res = await request(app).get('/videos/');
    expect(res.body[0]).toEqual({
      ...newVideo,
      title: 'hello title',
      author: 'hello author',
      publicationDate: '2023-01-12T08:12:39.261Z',
      canBeDownloaded: true,
      minAgeRestriction: 15,
    });
    newVideo = res.body[0];
  });

  it('- DELETE product by incorrect ID', async () => {
    const response = await request(app).get('/videos/');
    await request(app).delete('/videos/312').expect(404);

    expect(response.body[0]).toEqual({ ...response.body[0] });
  });
  it('+ DELETE product by correct ID, auth', async () => {
    await request(app)
      .delete('/videos/' + newVideo!.id)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(204);

    const res = await request(app).get('/videos/');
    expect(res.body.length).toBe(0);
  });
});
