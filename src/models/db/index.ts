import type { BlogModel } from '../blogs';
import type { PostModel } from '../posts';

export type DB = {
  blogs: BlogModel[];
  posts: PostModel[];
};
