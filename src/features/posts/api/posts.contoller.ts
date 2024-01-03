import { Response } from 'express';
import { HttpStatusCode } from 'axios';

import { postQueryRepository } from '../repositories';

import { postService } from '../services';

import type {
  CreatePostModel,
  QueryPostInputModel,
  UpdatePostModel,
} from '../models';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from '../../../types';
import { blogQueryRepository } from '../../blogs';

export const PostsController = {
  getPosts: async (
    req: RequestWithQuery<QueryPostInputModel>,
    res: Response
  ) => {
    const sortData = {
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const posts = await postQueryRepository.getAllPosts(sortData);
    res.send(posts);
  },

  getPostById: async (
    req: RequestWithParams<{ id: string }>,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const post = await postQueryRepository.getPostById(id);
      !post ? res.sendStatus(HttpStatusCode.NotFound) : res.send(post);
    } catch (error) {
      res.sendStatus(HttpStatusCode.BadRequest);
    }
  },

  createPost: async (req: RequestWithBody<CreatePostModel>, res: Response) => {
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

    res.status(HttpStatusCode.Created).send(newPost);
  },

  updatePost: async (
    req: RequestWithBody<UpdatePostModel, { id: string }>,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const payload = req.body;

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
    } catch (error) {
      res.sendStatus(HttpStatusCode.BadRequest);
    }
  },

  deletePost: async (req: RequestWithParams<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;

      const isDeleted = await postService.deletePost(id);
      isDeleted
        ? res.sendStatus(HttpStatusCode.NoContent)
        : res.sendStatus(HttpStatusCode.NotFound);
    } catch (error) {
      res.sendStatus(HttpStatusCode.BadRequest);
    }
  },
};
