import type { BaseDateEntity } from '@/types';

type BasePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type CreatePostModel = BasePostModel;
export type UpdatePostModel = BasePostModel;

export type CreatePostWithBlogNameModel = BasePostModel & { blogName: string };
export type UpdatePostWithBlogNameModel = BasePostModel & { blogName: string };

export type PostWithBlog = BaseDateEntity &
  BasePostModel & {
    id: string;
    blogId: string;
    blogName: string;
  };
