import express from 'express';
import { getBooksHandler } from './controllers/books.js';

// Create router instance
const router = express.Router();

// Define the routes
router.get('/books', getBooksHandler);

export default router;