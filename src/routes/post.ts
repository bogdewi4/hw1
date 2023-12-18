import { Request, Response, Router } from 'express';

import { RequestWithBody, RequestWithParams } from '../types';
import { authMiddleware } from '../middlewares/auth';

import { BlogRepository, PostRepository } from '../repositories';
import { CreatePostModel, UpdatePostModel } from '../models/posts';
import { postValidation } from '../validators/post';

export const postRoute = Router();

postRoute.get('/', (req: Request, res: Response) => {
  const posts = PostRepository.getAllPosts();
  res.send(posts);
});

postRoute.get(
  '/:id',
  (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const post = PostRepository.getPostById(id);
    !post ? res.sendStatus(404) : res.send(post);
  }
);

postRoute.post(
  '/',
  authMiddleware,
  postValidation(),
  (req: RequestWithBody<CreatePostModel>, res: Response) => {
    const post = req.body;
    const blog = BlogRepository.getBlogById(post.blogId);
    const newPost = PostRepository.createPost({
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
  (req: RequestWithBody<UpdatePostModel, { id: string }>, res: Response) => {
    const { id } = req.params;
    const post = req.body;
    const blog = BlogRepository.getBlogById(post.blogId);
    const isUpdated = PostRepository.updatePost({
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
  (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const isDeleted = PostRepository.deletePost(id);
    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }
);
