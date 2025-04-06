'use-strict';

import { Router } from 'express';
import validateUserRequest from '../middleware/user-request-data-validation.js';
import validateBookRequest from '../middleware/book-request-data-validation.js';
import registerBooksRouter from './books.js';
import registerUsersRouter from './users.js';

const router = new Router();
registerBooksRouter(validateBookRequest, router);
registerUsersRouter(validateUserRequest, router);

export default router;