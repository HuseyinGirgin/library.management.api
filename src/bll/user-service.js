'use-strict'

import { Sequelize } from 'sequelize';
import UserEntity from '../foundation/entity/user-entity.js';
import BookEntity from '../foundation/entity/book-entity.js';
import { UserBookProcessEntity, PROCESS_ENUM } from '../foundation/entity/user-book-process-entity.js';
import Utils from '../foundation/utils.js';
import DbManager from '../foundation/db/db-manager.js';

class UserService {
    async createNewUser(userName) {
        try {
            const existingUser = await UserEntity.findOne({
                where: { Name: userName }
            });
            if (Utils.assigned(existingUser)) {
                return {
                    ApiStatus: true,
                    ApiStatusCode: 400,
                    Message: 'Already created user',
                    Data: {
                        userId: existingUser.id
                    }
                }
            }

            const createdUserData = await UserEntity.create({ Name: userName });

            return {
                ApiStatus: true,
                ApiStatusCode: 201,
                Message: 'Succesfully created new user',
                Data: {
                    userId: createdUserData.id
                }
            }
        }
        catch (err) {
            console.log(`An error occurred while creating new user.Error:${err}`);
        }

        return null;
    }

    async getUserDataByUserId(userId) {
        try {
            const userData = await UserEntity.findByPk(userId);
            if (Utils.notAssigned(userData)) {
                return {
                    ApiStatus: true,
                    ApiStatusCode: 404,
                    Message: 'There is no user for requested userId',
                    Data: null
                }
            }

            let borrowedBookList = [];
            let returnedBookList = [];
            let page = 1;
            let pageSize = 100;
            let userBookOperationDataList = [];
            do {
                userBookOperationDataList = await UserBookProcessEntity.findAll({
                    where: {
                        UserId: userId
                    },
                    offset: (page - 1) * pageSize,
                    limit: pageSize
                });

                let userBorrowOperationDataList = userBookOperationDataList
                    .filter(({ dataValues }) => dataValues.ProcessName == PROCESS_ENUM.BORROW)
                    .map(({ dataValues }) => {
                        return {
                            name: dataValues.Name,
                            userScore: dataValues.UserScore
                        }
                    });
                borrowedBookList = borrowedBookList.concat(userBorrowOperationDataList);

                let userReturnOperationDataList = userBookOperationDataList
                    .filter(({ dataValues }) => dataValues.ProcessName == PROCESS_ENUM.RETURN)
                    .map(({ dataValues }) => {
                        return {
                            name:  dataValues.Name,
                        }
                    });
                returnedBookList = returnedBookList.concat(userReturnOperationDataList);
                page++;
            } while (Utils.isArrayAssigned(userBookOperationDataList));

            return {
                ApiStatus: true,
                ApiStatusCode: 200,
                Message: 'Succesfully has been taken user data by userId',
                Data: {
                    id: userData.id,
                    name: userData.Name,
                    books: {
                        past: borrowedBookList,
                        present: returnedBookList
                    }
                }
            }
        }
        catch (err) {
            console.log(`An error occurred while getting user by user id.Error:${err}`);
        }

        return null;
    }

    async getUserList() {
        try {
            let page = 1;
            let pageSize = 100;
            let userDataList = [];
            let responseDataList = [];
            do {
                userDataList = await UserEntity.findAll({
                    offset: (page - 1) * pageSize,
                    limit: pageSize
                });
                responseDataList = responseDataList
                    .concat(userDataList.map(({ dataValues }) => { return { id: dataValues.id, name: dataValues.Name } }));

                page++;
            } while (Utils.isArrayAssigned(userDataList))

            return {
                ApiStatus: true,
                ApiStatusCode: 200,
                Message: 'Succesfully fetched all user list',
                Data: responseDataList
            }
        }
        catch (err) {
            console.log(`An error occurred while getting user list.Error:${err}`);
        }

        return null;
    }

    async userBorrowBookByBookId(userId, bookId) {
        let responseObj = {}
        try {
            await DbManager.transaction(async (transaction) => {
                const operationData = await this.__manageUserBookOperation(userId, bookId, 0, PROCESS_ENUM.BORROW, transaction);
                if (Utils.notAssigned(operationData?.userData)) {
                    responseObj = {
                        ApiStatus: false,
                        ApiStatusCode: 400,
                        Message: 'There is no user for requested userId.',
                        Data: null

                    }

                    return;
                }

                if (Utils.notAssigned(operationData?.bookData)) {
                    responseObj = {
                        ApiStatus: false,
                        ApiStatusCode: 400,
                        Message: 'There is no book for requested bookId',
                        Data: null

                    }

                    return;
                }

                if (Utils.notAssigned(operationData?.userBookOperationData)) {
                    responseObj = {
                        ApiStatus: false,
                        ApiStatusCode: 400,
                        Message: 'The book that you want to borrow was already borrowed.',
                        Data: null

                    }

                    return;
                }

                responseObj = {
                    ApiStatus: true,
                    ApiStatusCode: 204,
                    Message: 'User borrow book by bookId.',
                    Data: null
                }

                return;
            });

            return responseObj;
        }
        catch (err) {
            console.log(`An error occurred while borrowing book by bookId.Error:${err}`);
        }

        return null;
    }

    async userReturnBookByBookId(userId, bookId, score) {
        let responseObj = {}
        try {
            await DbManager.transaction(async (transaction) => {
                const operationData = await this.__manageUserBookOperation(userId, bookId, score, PROCESS_ENUM.RETURN);
                if (Utils.notAssigned(operationData?.userData)) {
                    responseObj = {
                        ApiStatus: false,
                        ApiStatusCode: 400,
                        Message: 'There is no user for requested userId.',
                        Data: null

                    }

                    return;
                }

                if (Utils.notAssigned(operationData?.bookData)) {
                    responseObj = {
                        ApiStatus: false,
                        ApiStatusCode: 400,
                        Message: 'There is no book for requested bookId',
                        Data: null
                    }

                    return;
                }

                if (Utils.notAssigned(operationData?.userBookOperationData)) {
                    responseObj = {
                        ApiStatus: false,
                        ApiStatusCode: 400,
                        Message: 'The book that you want to return was already returned.',
                        Data: null
                    }

                    return;
                }

                const [scoreBasedData] = await UserBookProcessEntity.findAll({
                    attributes: [
                        [Sequelize.fn('SUM', Sequelize.col('user_score')), 'totalScore'],
                        [Sequelize.fn('COUNT', Sequelize.col('user_score')), 'scoreCount']
                    ],
                    where: {
                        ProcessName: PROCESS_ENUM.RETURN,
                    },
                    transaction
                });

                const totalScore = scoreBasedData.get('totalScore') || 0;
                const scoreCount = scoreBasedData.get('scoreCount') || 0;
                await BookEntity.update(
                    { userScore: scoreCount == 0 ? 0 : totalScore / scoreCount },
                    {
                        where: { id: bookId },
                        transaction
                    }
                );

                responseObj = {
                    ApiStatus: true,
                    ApiStatusCode: 204,
                    Message: 'User returned book by bookId.',
                    Data: null
                }

                return;
            });

            return responseObj;
        }
        catch (err) {
            console.log(`An error occurred while returning book by bookId.Error:${err}`);
        }

        return null;
    }

    async __manageUserBookOperation(userId, bookId, score, operation, transaction) {
        const operationData = {
            userData: null,
            bookData: null,
            userBookOperationData: null
        }
        operationData.userData = await UserEntity.findByPk(userId, { transaction });
        if (Utils.notAssigned(operationData.userData)) {
            return operationData;
        }

        operationData.bookData = await BookEntity.findByPk(bookId, { transaction });
        if (Utils.notAssigned(operationData.bookData)) {
            return operationData;
        }

        const [instance, isCreated] = await UserBookProcessEntity.upsert({
            UserId: userId,
            BookId: bookId,
            ProcessName: operation,
            UserScore: score
        }, {
            where: {
                BookId: {
                    [Sequelize.Op.ne]: bookId,
                },
                ProcessName: {
                    [Sequelize.Op.ne]: operation,
                }
            },
            transaction
        });

        operationData.userBookOperationData = instance;

        return operationData;
    }
}

export default UserService;