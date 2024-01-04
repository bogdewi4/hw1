import { ObjectId, type Collection } from 'mongodb';

import { UserDB } from '../../../models/db';
import { DataWithPagination, SortDir } from '../../../types';
import { client } from '../../../db';
import { QueryUserInputModel, UserDTO, userMapper } from '../models';

class UserQueryRepository {
  private validateId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Id is not a valid');
    }
  }

  constructor(private db: Collection<UserDB>) {
    this.db = db;
  }

  async getAllUsers(
    sortData: QueryUserInputModel
  ): Promise<DataWithPagination<UserDTO[]>> {
    const searchEmailTerm = sortData.searchEmailTerm ?? null;
    const searchLoginTerm = sortData.searchLoginTerm ?? null;
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? SortDir.DESC;
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;

    let filter = {};

    if (searchEmailTerm && searchLoginTerm) {
      filter = {
        $or: [
          {
            ...(searchEmailTerm && {
              email: {
                $regex: searchEmailTerm,
                $options: 'i',
              },
            }),
          },
          {
            ...(searchLoginTerm && {
              login: {
                $regex: searchLoginTerm,
                $options: 'i',
              },
            }),
          },
        ],
      };
    } else if (searchEmailTerm) {
      filter = {
        email: {
          $regex: searchEmailTerm,
          $options: 'i',
        },
      };
    } else if (searchLoginTerm) {
      filter = {
        login: {
          $regex: searchLoginTerm,
          $options: 'i',
        },
      };
    }

    const users = await this.db
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const totalCount = await this.db.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: users.map(userMapper),
    };
  }

  async getUserById(id: string): Promise<UserDTO | null> {
    this.validateId(id);

    const user = await this.db.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }

    return userMapper(user);
  }
}

export const userQueryRepository = new UserQueryRepository(
  client.db().collection<UserDB>('user')
);
