import express from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';

// Create router instance
const router = express.Router();

// Define the routes
router.get('/books', getBooksHandler);
router.get('/books/:id', getBookByIdHandler);

export default router;