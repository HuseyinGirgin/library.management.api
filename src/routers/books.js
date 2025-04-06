'use-strict';

import BookController from '../controller/book-controller.js';

function init(validateRequest, router) {
    router.get('/books',
        validateRequest,
        (req, res) => new BookController().getBooks(req, res));

    router.get('/books/:id',
        validateRequest,
        (req, res) => new BookController().getBookByBookId(req, res));

    router.post('/books',
        validateRequest,
        (req, res) => new BookController().createBook(req, res));
}

export default init;