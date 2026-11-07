import {
    authorExists,
    createBook,
    deleteBook,
    getAllBooks,
    getBookById,
    updateBook,
} from '../models/books.js';

const isRequiredString = (value) => {return typeof value === 'string' && value.trim().length > 0};

const isISODate = (value) => {
    if (!isRequiredString(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(value);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('GET /books failed:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getBookByIdHandler = async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await getBookById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.error('GET /books/:id failed:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const createBookHandler = async (req, res) => {
    const { id, authorId, title, publicationDate } = req.body ?? {};
    if (![id, authorId, title].every(isRequiredString) || !isISODate(publicationDate)) {
        return res.status(400).json({
            message: 'id, authorId, title, and a valid publicationDate (YYYY-MM-DD) are required.',
        });
    }

    const book = { id, authorId, title, publicationDate };
    try {
        if (await getBookById(id)) {
            return res.status(400).json({ message: 'A book with this id already exists.' });
        }
        if (!(await authorExists(authorId))) {
            return res.status(400).json({ message: 'authorId must match an existing author.' });
        }

        await createBook(book);
        return res.status(201).json(book);
    } catch (error) {
        console.error('POST /books failed:', error.message);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A book with this id already exists.' });
        }
        return res.status(500).json({ message: 'Unable to create book.' });
    }
};

const updateBookHandler = async (req, res) => {
    const { authorId, title, publicationDate } = req.body ?? {};
    if (![authorId, title].every(isRequiredString) || !isISODate(publicationDate)) {
        return res.status(400).json({
            message: 'authorId, title, and a valid publicationDate (YYYY-MM-DD) are required.',
        });
    }

    const id = req.params.id;
    const book = { authorId, title, publicationDate };
    try {
        if (!(await authorExists(authorId))) {
            return res.status(400).json({ message: 'authorId must match an existing author.' });
        }

        const result = await updateBook(id, book);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(200).json({ id, ...book });
    } catch (error) {
        console.error('PUT /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Unable to update book.' });
    }
};

const deleteBookHandler = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await deleteBook(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(204).end();
    } catch (error) {
        console.error('DELETE /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Unable to delete book.' });
    }
};

export {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler,
};