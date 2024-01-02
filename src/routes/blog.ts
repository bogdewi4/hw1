import { Router } from 'express';
import type { Response } from 'express';
import { HttpStatusCode } from 'axios';

import {
  blogRepository as blogQueryRepository,
  postRepository as postQueryRepository,
} from '../query-repositories';
import {
  type RequestWithBody,
  type RequestWithParams,
  type RequestWithParamsAndQuery,
  type RequestWithQuery,
} from '../types';
import { authMiddleware } from '../middlewares/auth';
import { blogPostValidation, blogValidation } from '../validators/blog';
import type {
  CreateBlogModel,
  CreatePostBlogModel,
  QueryBlogInputModel,
  QueryPostByBlogIdInputModel,
} from '../models/blogs';
import { ObjectId } from 'mongodb';
import { blogService } from '../domain';
export const blogRoute = Router();

blogRoute.get(
  '/',
  async (req: RequestWithQuery<QueryBlogInputModel>, res: Response) => {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const blogs = await blogQueryRepository.getAllBlogs(sortData);
    res.send(blogs);
  }
);

blogRoute.get(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.sendStatus(HttpStatusCode.BadRequest);
      return;
    }

    const blog = await blogQueryRepository.getBlogById(id);
    !blog ? res.sendStatus(HttpStatusCode.NotFound) : res.send(blog);
  }
);

blogRoute.get(
  '/:id/posts',
  async (
    req: RequestWithParamsAndQuery<{ id: string }, QueryPostByBlogIdInputModel>,
    res: Response
  ) => {
    const { id } = req.params;
    const sortData = {
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };

    if (!ObjectId.isValid(id)) {
      res.sendStatus(HttpStatusCode.BadRequest);
      return;
    }

    const blog = await blogQueryRepository.getBlogById(id);

    if (!blog) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

    const post = await blogQueryRepository.getPostsByBlogId(blog.id, sortData);
    res.send(post);
  }
);

blogRoute.post(
  '/',
  authMiddleware,
  blogValidation(),
  async (req: RequestWithBody<CreateBlogModel>, res: Response) => {
    const blogPayload = req.body;

    const createdBlogId = await blogService.createBlog(blogPayload);
    const createdBlog = await blogQueryRepository.getBlogById(createdBlogId);

    if (!createdBlog) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

    res.status(HttpStatusCode.Created).send(createdBlog);
  }
);
blogRoute.post(
  '/:id/posts',
  authMiddleware,
  blogPostValidation(),
  async (
    req: RequestWithBody<CreatePostBlogModel, { id: string }>,
    res: Response
  ) => {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;

    const blogId = req.params.id;

    const blog = await blogQueryRepository.getBlogById(blogId);

    if (!blog) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

    const createdPostId = await blogService.createPostToBlog(blogId, {
      title,
      shortDescription,
      content,
    });

    const post = await postQueryRepository.getPostById(createdPostId);

    if (!post) {
      res.sendStatus(HttpStatusCode.NotFound);
      return;
    }

    res.status(201).send(post);
  }
);

blogRoute.put(
  '/:id',
  authMiddleware,
  blogValidation(),
  async (
    req: RequestWithBody<CreateBlogModel, { id: string }>,
    res: Response
  ) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HttpStatusCode.BadRequest);
      return;
    }

    const blog = req.body;
    const isUpdated = await blogService.updateBlog(id, { ...blog });
    isUpdated
      ? res.sendStatus(HttpStatusCode.NoContent)
      : res.sendStatus(HttpStatusCode.NotFound);
  }
);

blogRoute.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HttpStatusCode.BadRequest);
      return;
    }

    const isDeleted = await blogService.deleteBlog(id);
    isDeleted
      ? res.sendStatus(HttpStatusCode.NoContent)
      : res.sendStatus(HttpStatusCode.NotFound);
  }
);
