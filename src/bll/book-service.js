'use-strict'

import BookEntity from '../foundation/entity/book-entity.js';
import Utils from '../foundation/utils.js';

class BookService {

    async createNewBook(bookName) {
        try {
            const existingBook = await BookEntity.findOne({
                where: { Name: bookName }
            });
            if (Utils.assigned(existingBook)) {
                return {
                    ApiStatus: true,
                    ApiStatusCode: 400,
                    Message: 'Already created book',
                    Data: {
                        bookId: existingBook.id
                    }
                }
            }

            const createdBookData = await BookEntity.create({ Name: bookName });

            return {
                ApiStatus: true,
                ApiStatusCode: 201,
                Message: 'Succesfully created new book',
                Data: {
                    bookId: createdBookData.id
                }
            }
        }
        catch (err) {
            console.log(`An error occurred while creating book list.Error:${err}`);
        }

        return null;
    }

    async getBookByBookId(bookId) {
        try {
            const bookData = await BookEntity.findByPk(bookId);
            if (Utils.notAssigned(bookData)) {
                return {
                    ApiStatus: true,
                    ApiStatusCode: 404,
                    Message: 'There is no book for requested bookId',
                    Data: null
                }
            }

            return {
                ApiStatus: true,
                ApiStatusCode: 200,
                Message: 'Succesfully has been taken book by bookId',
                Data: {
                    id: bookData.id,
                    name: bookData.Name,
                    score: bookData.Score
                }
            }
        }
        catch (err) {
            console.log(`An error occurred while getting book by book id.Error:${err}`);
        }

        return null;
    }

    async getAllBookList() {
        try {
            let page = 1;
            let pageSize = 100;
            let bookDataList = [];
            let responseDataList = [];
            do {
                bookDataList = await BookEntity.findAll({
                    offset: (page - 1) * pageSize,
                    limit: pageSize
                });
                responseDataList = responseDataList
                    .concat(bookDataList.map(({ dataValues }) => { return { id: dataValues.id, name: dataValues.Name } }));

                page++;
            } while (Utils.isArrayAssigned(bookDataList))

            return {
                ApiStatus: true,
                ApiStatusCode: 200,
                Message: 'Succesfully fetched all book list',
                Data: responseDataList
            }
        }
        catch (err) {
            console.log(`An error occurred while getting book list.Error:${err}`);
        }

        return null;
    }
}

export default BookService;