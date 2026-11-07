import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
    const collection = await getDb().collection('books');
    const books = await collection.find({}).toArray();
    return books;
};

const getBookById = async (bookId) => {
    const collection = await getDb().collection('books');
    const book = await collection.findOne({ id: bookId });
    return book;
};

const createBook = async (book) => {
    const db = getDb();
    const collection = db.collection('books');
    const result = await collection.insertOne(book);
    return result;
};

const updateBook = async (id, book) => {
    const db = getDb();
    const collection = db.collection('books');
    const result = await collection.updateOne({ id }, { $set: book });
    return result;
};

const deleteBook = async (id) => {
    const db = getDb();
    const collection = db.collection('books');
    const result = await collection.deleteOne({ id });
    return result;
};

const authorExists = async (id) => {
    const db = getDb();
    const collection = db.collection('authors');
    const author = await collection.findOne({ id });
    return Boolean(author);
};

export {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    authorExists,
};