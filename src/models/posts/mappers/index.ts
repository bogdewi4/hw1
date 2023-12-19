import type { WithId } from 'mongodb';
import type { PostDB } from '../../db';
import type { PostModel } from '../output';

export const postMapper = ({ _id, ...postDb }: WithId<PostDB>): PostModel => {
  return { id: _id.toString(), ...postDb };
};
