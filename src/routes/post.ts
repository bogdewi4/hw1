import { Request, Response, Router } from 'express';

import { RequestWithBody, RequestWithParams } from '../types';
import { authMiddleware } from '../middlewares/auth';

import { blogRepository, postRepository } from '../repositories';
import { CreatePostModel, UpdatePostModel } from '../models/posts';
import { postValidation } from '../validators/post';
import { ObjectId } from 'mongodb';

export const postRoute = Router();

postRoute.get('/', async (req: Request, res: Response) => {
  const posts = await postRepository.getAllPosts();
  res.send(posts);
});

postRoute.get(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(400);
      return;
    }

    const post = await postRepository.getPostById(id);
    !post ? res.sendStatus(404) : res.send(post);
  }
);

postRoute.post(
  '/',
  authMiddleware,
  postValidation(),
  async (req: RequestWithBody<CreatePostModel>, res: Response) => {
    const post = req.body;
    const blog = await blogRepository.getBlogById(post.blogId);
    const newPost = await postRepository.createPost({
      ...post,
      blogName: blog!.name,
    });
    res.status(201).send(newPost);
  }
);

postRoute.put(
  '/:id',
  authMiddleware,
  postValidation(),
  async (
    req: RequestWithBody<UpdatePostModel, { id: string }>,
    res: Response
  ) => {
    const { id } = req.params;
    const post = req.body;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(400);
      return;
    }

    const blog = await blogRepository.getBlogById(post.blogId);
    const isUpdated = await postRepository.updatePost({
      ...post,
      id,
      blogName: blog!.name,
    });
    isUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }
);

postRoute.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(400);
      return;
    }

    const isDeleted = await postRepository.deletePost(id);
    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }
);
