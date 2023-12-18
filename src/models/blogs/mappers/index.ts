import { WithId } from 'mongodb';
import { BlogDB } from '../../db';
import { BlogModel } from '../output';

export const blogMapper = ({ _id, ...blogDb }: WithId<BlogDB>): BlogModel => {
  return { id: _id.toString(), ...blogDb };
};
