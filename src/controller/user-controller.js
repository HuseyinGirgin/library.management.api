'use-strict'

import ApiController from '../foundation/api-controller.js';
import UserService from '../bll/user-service.js';
import Utils from '../foundation/utils.js';

class UserController extends ApiController {
    constructor() {
        super();
    }

    async createNewUser(req, res) {
        try {
            const name = req?.body?.name;
            if (Utils.notAssigned(name)) {
                return this.sendSuccess(res, null, 400, 'User name can not be empty');
            }
            const userService = new UserService();
            const responseData = await userService.createNewUser(name);
            if (Utils.notAssigned(responseData)) {
                return this.sendError(res, 500, 'Unexpected error was occurred');
            }

            return this.sendSuccess(res, responseData.Data, responseData.ApiStatusCode, responseData.Message);
        } catch (error) {
            console.log(`An error occurred while creating new user.Err:${error}`);
            return this.sendError(res, 500, 'Unexpected error was occurred on server side');
        }
    }

    async getUserDataByUserId(req, res) {
        try {
            const userId = req?.params?.id;
            if (Utils.notAssigned(userId)) {
                return this.sendSuccess(res, null, 400, 'UserId can not be empty');
            }

            const userService = new UserService();
            const responseData = await userService.getUserDataByUserId(userId);
            if (Utils.notAssigned(responseData)) {
                return this.sendError(res, 500, 'Unexpected error was occurred');
            }

            return this.sendSuccess(res, responseData.Data, responseData.ApiStatusCode, responseData.Message);
        } catch (error) {
            console.log(`An error occurred while getting user data by user id.Err:${error}`);
            return this.sendError(res, 500, 'Unexpected error was occurred on server side');
        }
    }

    async getUsers(req, res) {
        try {
            const userService = new UserService();
            const responseData = await userService.getUserList();
            if (Utils.notAssigned(responseData)) {
                return this.sendError(res, 500, 'Unexpected error was occurred');
            }

            return this.sendSuccess(res, responseData.Data, responseData.ApiStatusCode, responseData.Message);
        } catch (error) {
            console.log(`An error occurred while getting users.Err:${error}`);
            return this.sendError(res, 500, 'Unexpected error was occurred on server side');
        }
    }

    async userBorrowBookByBookId(req, res) {
        try {
            const userId = req?.params?.userId;
            if (Utils.notAssigned(userId)) {
                return this.sendSuccess(res, null, 400, 'UserId can not be empty');
            }

            const bookId = req?.params?.bookId;
            if (Utils.notAssigned(bookId)) {
                return this.sendSuccess(res, null, 400, 'BookId can not be empty');
            }

            const userService = new UserService();
            const responseData = await userService.userBorrowBookByBookId(userId, bookId);
            if (Utils.notAssigned(responseData)) {
                return this.sendError(res, 500, 'Unexpected error was occurred');
            }

            return this.sendSuccess(res, responseData.Data, responseData.ApiStatusCode, responseData.Message);
        } catch (error) {
            console.log(`An error occurred while borrowing book by id.Err:${error}`);
            return this.sendError(res, 500, 'Unexpected error was occurred on server side');
        }
    }

    async userReturnBookByBookId(req, res) {
        try {
            const userId = req?.params?.userId;
            if (Utils.notAssigned(userId)) {
                return this.sendSuccess(res, null, 400, 'UserId can not be empty');
            }

            const bookId = req?.params?.bookId;
            if (Utils.notAssigned(bookId)) {
                return this.sendSuccess(res, null, 400, 'BookId can not be empty');
            }

            const score = req?.body?.score;
            if (Utils.notAssigned(score)) {
                return this.sendSuccess(res, null, 400, 'Score can not be empty');
            }

            const userService = new UserService();
            const responseData = await userService.userReturnBookByBookId(userId, bookId, score);
            if (Utils.notAssigned(responseData)) {
                return this.sendError(res, 500, 'Unexpected error was occurred');
            }

            return this.sendSuccess(res, responseData.Data, responseData.ApiStatusCode, responseData.Message);
        } catch (error) {
            console.log(`An error occurred while returning book by bookId.Err:${error}`);
            return this.sendError(res, 500, 'Unexpected error was occurred on server side');
        }
    }
}

export default UserController;