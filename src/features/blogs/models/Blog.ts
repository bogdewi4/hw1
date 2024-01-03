import type { BaseDateEntity } from '../../../types';

type BaseBlogModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type CreateBlogModel = BaseBlogModel;
export type UpdateBlogModel = BaseBlogModel;

export type CreatePostBlogModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type BlogWithMembership = BaseDateEntity &
  BaseBlogModel & {
    id: string;
    isMembership: boolean;
  };
