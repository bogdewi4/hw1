import { Router } from 'express';

import { BlogController } from '@/features/blogs';

import { authMiddleware } from '@/middlewares/auth';

import { blogPostValidation, blogValidation } from '@/validators/blog';

export const blogRoute = Router();

blogRoute.get('/', BlogController.getBlogs);

blogRoute.get('/:id', BlogController.getBlogById);

blogRoute.get('/:id/posts', BlogController.getPostsByBlogId);

blogRoute.post(
  '/',
  authMiddleware,
  blogValidation(),
  BlogController.createBlog
);
blogRoute.post(
  '/:id/posts',
  authMiddleware,
  blogPostValidation(),
  BlogController.createPostToBlog
);

blogRoute.put(
  '/:id',
  authMiddleware,
  blogValidation(),
  BlogController.updateBlog
);

blogRoute.delete('/:id', authMiddleware, BlogController.deleteBlog);
