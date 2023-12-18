import { WithId } from 'mongodb';
import { PostDB } from '../../db';
import { PostModel } from '../output';

export const postMapper = ({ _id, ...postDb }: WithId<PostDB>): PostModel => {
  return { id: _id.toString(), ...postDb };
};
