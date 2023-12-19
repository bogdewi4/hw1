import type { WithId } from 'mongodb';
import type { BlogDB } from '../../db';
import type { BlogModel } from '../output';

export const blogMapper = ({ _id, ...blogDb }: WithId<BlogDB>): BlogModel => {
  return { id: _id.toString(), ...blogDb };
};
