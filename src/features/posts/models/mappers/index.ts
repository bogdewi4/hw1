import type { WithId } from 'mongodb';

import type { PostWithBlogDTO } from '../dto';
import { PostDB } from '../../../../models/db';

export const postMapper = ({
  _id,
  ...postDb
}: WithId<PostDB>): PostWithBlogDTO => {
  return {
    id: _id.toString(),
    title: postDb.title,
    shortDescription: postDb.shortDescription,
    content: postDb.content,
    blogName: postDb.blogName,
    blogId: postDb.blogId,
    createdAt: postDb.createdAt,
  };
};
