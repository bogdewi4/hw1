import { Response } from 'express';
import { HttpStatusCode } from 'axios';

import { userQueryRepository } from '../repositories';

import { userService } from '../services';

import {
  RequestWithBody,
  RequestWithParams,
  RequestWithQuery,
} from '../../../types';
import { CreateUserModel, QueryUserInputModel } from '../models';

export const UsersController = {
  getUsers: async (
    req: RequestWithQuery<QueryUserInputModel>,
    res: Response
  ) => {
    const sortData = {
      searchEmailTerm: req.query.searchEmailTerm,
      searchLoginTerm: req.query.searchLoginTerm,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
    };
    const users = await userQueryRepository.getAllUsers(sortData);
    res.send(users);
  },

  createUser: async (req: RequestWithBody<CreateUserModel>, res: Response) => {
    try {
      const data = req.body;

      const createdUserId = await userService.createUser({
        ...data,
      });

      const newUser = await userQueryRepository.getUserById(createdUserId);

      if (!newUser) {
        res.sendStatus(HttpStatusCode.NotFound);
        return;
      }

      res.status(HttpStatusCode.Created).send(newUser);
    } catch (error) {
      if (error === 'UNAUTHORIZED') {
        res.sendStatus(HttpStatusCode.Unauthorized);
      }
    }
  },

  deleteUser: async (req: RequestWithParams<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;

      const isDeleted = await userService.deleteUser(id);
      isDeleted
        ? res.sendStatus(HttpStatusCode.NoContent)
        : res.sendStatus(HttpStatusCode.NotFound);
    } catch (error) {
      res.sendStatus(HttpStatusCode.BadRequest);
    }
  },
};
