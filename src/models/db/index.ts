import type { BlogModel } from '../blogs';
import type { PostModel } from '../posts';

export type BlogDB = Omit<BlogModel, 'id'>;
export type PostDB = Omit<PostModel, 'id'>;
