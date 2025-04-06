'use-strict'

import ApiController from '../foundation/api-controller.js';
import BookService from '../bll/book-service.js';
import Utils from '../foundation/utils.js';

class BookController extends ApiController {
    constructor() {
        super();
    }

    async createBook(req, res) {
        try {
            const name = req?.body?.name;
            if (Utils.isStringEmpty(name)) {
                return this.sendSuccess(res, null, 400, 'Book name can not be empty');
            }

            const bookService = new BookService();
            const responseData = await bookService.createNewBook(name);
            if (Utils.notAssigned(responseData)) {
                return this.sendError(res, 500, 'Unexpected error was occurred');
            }

            return this.sendSuccess(res, responseData.Data, responseData.ApiStatusCode, responseData.Message);
        } catch (error) {
            console.log(`An error occurred while creating new book.Err:${error}`);
            return this.sendError(res, 500, 'Unexpected error was occurred on server side');
        }
    }

    async getBookByBookId(req, res) {
        try {
            const bookId = req?.params?.id
            if (Utils.notAssigned(bookId)) {
                return this.sendSuccess(res, null, 400, 'Book id can not be empty');
            }

            const bookService = new BookService();
            const responseData = await bookService.getBookByBookId(bookId);
            if (Utils.notAssigned(responseData)) {
                return this.sendError(res, 500, 'Unexpected error was occurred');
            }

            return this.sendSuccess(res, responseData.Data, responseData.ApiStatusCode, responseData.Message);
        } catch (error) {
            console.log(`An error occurred while getting book by id.Err:${error}`);
            return this.sendError(res, 500, 'Unexpected error was occurred on server side');
        }
    }

    async getBooks(req, res) {
        try {
            const bookService = new BookService();
            const responseData = await bookService.getAllBookList();
            if (Utils.notAssigned(responseData)) {
                return this.sendError(res, 500, 'Unexpected error was occurred');
            }

            return this.sendSuccess(res, responseData.Data, responseData.ApiStatusCode, responseData.Message);
        } catch (error) {
            console.log(`An error occurred while getting all books.Err:${error}`);
            return this.sendError(res, 500, 'Unexpected error was occurred on server side');
        }
    }
}

export default BookController;