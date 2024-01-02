import type { WithId } from 'mongodb';

import type { PostModel } from '../output';

import type { PostDB } from '../../db';

export const postMapper = ({ _id, ...postDb }: WithId<PostDB>): PostModel => {
  return {
    id: _id.toString(),
    title: postDb.title,
    shortDescription: postDb.shortDescription,
    content: postDb.content,
    blogName: postDb.content,
    blogId: postDb.blogId,
    createdAt: postDb.createdAt,
  };
};
