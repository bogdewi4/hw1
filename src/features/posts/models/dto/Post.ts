import type { BaseDateEntity } from '@/types';

type PostBaseDTO = BaseDateEntity & {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
};

export type PostWithBlogDTO = PostBaseDTO & {
  blogId: string;
  blogName: string;
};
