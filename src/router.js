import express from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';
import {
    createAuthorHandler,
    deleteAuthorHandler,
    getAuthorsHandler,
    getAuthorByIdHandler,
    updateAuthorHandler,
} from './controllers/authors.js';

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

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: A list of authors
 *       500:
 *         description: Unable to retrieve authors
 */
router.get('/authors', getAuthorsHandler);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create an author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - surname
 *               - birthYear
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               birthYear:
 *                 type: string
 *           example:
 *             id: a2
 *             name: Harper
 *             surname: Lee
 *             birthYear: "1926"
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Required fields are missing or the author ID already exists
 *       500:
 *         description: Unable to create author
 */
router.post('/authors', createAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *  get:
 *     summary: Get an author by ID
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the author to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author returned successfully
 *       404:
 *         description: Author not found
 *       500:
 *         description: Unable to retrieve author
 */
router.get('/authors/:id', getAuthorByIdHandler);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom ID of the author to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - birthYear
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               birthYear:
 *                 type: string
 *           example:
 *             name: Harper
 *             surname: Lee
 *             birthYear: "1926"
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       400:
 *         description: Required fields are missing
 *       404:
 *         description: Author not found
 *       500:
 *         description: Unable to update author
 */
router.put('/authors/:id', updateAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom ID of the author to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Author deleted successfully
 *       400:
 *         description: Author cannot be deleted while books reference it
 *       404:
 *         description: Author not found
 *       500:
 *         description: Unable to delete author
 */
router.delete('/authors/:id', deleteAuthorHandler);

export default router;