'use-strict';

import UserController from '../controller/user-controller.js';

function init(validateRequest, router) {
    router.get('/users',
        validateRequest,
        (req, res) => new UserController().getUsers(req, res));

    router.get('/users/:id',
        validateRequest,
        (req, res) => new UserController().getUserDataByUserId(req, res));

    router.post('/users',
        validateRequest,
        (req, res) => new UserController().createNewUser(req, res));

    router.post('/users/:userId/borrow/:bookId',
        validateRequest,
        (req, res) => new UserController().userBorrowBookByBookId(req, res));

    router.post('/users/:userId/return/:bookId',
        validateRequest,
        (req, res) => new UserController().userReturnBookByBookId(req, res));
}

export default init;