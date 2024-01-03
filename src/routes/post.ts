import { Router } from 'express';

import { PostsController } from '@/features/posts';

import { authMiddleware } from '@/middlewares/auth';

import { postValidation } from '@/validators/post';

export const postRoute = Router();

postRoute.get('/', PostsController.getPosts);

postRoute.get('/:id', PostsController.getPostById);

postRoute.post(
  '/',
  authMiddleware,
  postValidation(),
  PostsController.createPost
);

postRoute.put(
  '/:id',
  authMiddleware,
  postValidation(),
  PostsController.updatePost
);

postRoute.delete('/:id', authMiddleware, PostsController.deletePost);
