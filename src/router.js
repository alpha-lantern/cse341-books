import express from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';

// Create router instance
const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: Books returned successfully
 *       500:
 *         description: Unable to retrieve books
 */

// Define the routes
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to retrieve, such as b1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Unable to retrieve book
 */
router.get('/books/:id', getBookByIdHandler);

export default router;