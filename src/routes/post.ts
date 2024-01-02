import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { HttpStatusCode } from 'axios';
import type { Response } from 'express';

import type {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from '../types';
import { authMiddleware } from '../middlewares/auth';
import {
  blogRepository as blogQueryRepository,
  postRepository as postQueryRepository,
} from '../query-repositories';
import type {
  CreatePostModel,
  QueryPostInputModel,
  UpdatePostModel,
} from '../models/posts';
import { postValidation } from '../validators/post';
import { postService } from '../domain';

export const postRoute = Router();

postRoute.get(
  '/',
  async (req: RequestWithQuery<QueryPostInputModel>, res: Response) => {
    const sortData = {
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const posts = await postQueryRepository.getAllPosts(sortData);
    res.send(posts);
  }
);

postRoute.get(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(400);
      return;
    }

    const post = await postQueryRepository.getPostById(id);
    !post ? res.sendStatus(404) : res.send(post);
  }
);

postRoute.post(
  '/',
  authMiddleware,
  postValidation(),
  async (req: RequestWithBody<CreatePostModel>, res: Response) => {
    const post = req.body;
    const blog = await blogQueryRepository.getBlogById(post.blogId);

    if (!blog) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

    const createPostId = await postService.createPost({
      ...post,
      blogName: blog!.name,
    });

    const newPost = await postQueryRepository.getPostById(createPostId);

    if (!newPost) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

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
    const payload = req.body;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(400);
      return;
    }

    const post = await postQueryRepository.getPostById(id);

    if (!post) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

    const blog = await blogQueryRepository.getBlogById(post.blogId);

    if (!blog) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

    const isUpdated = await postService.updatePost(id, {
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogId: blog!.id,
      blogName: blog!.name,
    });

    isUpdated
      ? res.sendStatus(HttpStatusCode.NoContent)
      : res.sendStatus(HttpStatusCode.NotFound);
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

    const isDeleted = await postService.deletePost(id);
    isDeleted
      ? res.sendStatus(HttpStatusCode.NoContent)
      : res.sendStatus(HttpStatusCode.NotFound);
  }
);
