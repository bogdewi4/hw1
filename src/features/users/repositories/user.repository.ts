import { type Collection, ObjectId } from 'mongodb';

import type { QueryUserInputModel, UserModel } from '../models';
import { PostDB, UserDB } from '../../../models/db';
import { DataWithPagination, SortDir } from '../../../types';
import { mapMongoDocumentToPlainId } from '../../../models/db/mapper';
import { client } from '../../../db';

class UserRepository {
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
  ): Promise<DataWithPagination<UserModel[]>> {
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? SortDir.DESC;
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;

    const users = await this.db
      .find()
      .sort(sortBy, sortDirection)
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const totalCount = await this.db.countDocuments();
    const pagesCount = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: +pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: users.map(mapMongoDocumentToPlainId),
    };
  }

  async createUser(data: Omit<UserModel, 'id'>): Promise<{ id: string }> {
    const user = await this.db.insertOne({ ...data });

    return {
      id: user.insertedId.toString(),
    };
  }

  async deletePost(id: string): Promise<boolean> {
    this.validateId(id);

    const deletedUserEntity = await this.db.deleteOne({
      _id: new ObjectId(id),
    });

    return !!deletedUserEntity.deletedCount;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDB | null> {
    const user = await this.db.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    if (!user) {
      return null;
    }

    return mapMongoDocumentToPlainId(user);
  }
}

export const userRepository = new UserRepository(
  client.db().collection<UserDB>('user')
);
