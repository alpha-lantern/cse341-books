import {
    authorHasBooks,
    createAuthor,
    deleteAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
} from '../models/authors.js';

const isRequiredString = (value) => {return typeof value === 'string' && value.trim().length > 0};

const getAuthorsHandler = async (req, res) => {
    try {
        const authors = await getAllAuthors();
        return res.status(200).json(authors);
    } catch (error) {
        console.error('GET /authors failed:', error.message);
        return res.status(500).json({ error: 'Unable to retrieve authors.' });
    }
};

const getAuthorByIdHandler = async (req, res) => {
    const authorId = req.params.id;
    try {
        const author = await getAuthorById(authorId);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        return res.status(200).json(author);
    } catch (error) {
        console.error('GET /authors/:id failed:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const createAuthorHandler = async (req, res) => {
    const { id, name, surname, birthYear } = req.body ?? {};
    if (![id, name, surname, birthYear].every(isRequiredString)) {
        return res.status(400).json({ message: 'id, name, surname, and birthYear are required strings.' });
    }

    const author = { id, name, surname, birthYear };
    try {
        if (await getAuthorById(id)) {
            return res.status(400).json({ message: 'An author with this id already exists.' });
        }

        await createAuthor(author);
        return res.status(201).json(author);
    } catch (error) {
        console.error('POST /authors failed:', error.message);
        // Handle duplicate key error (E11000) for MongoDB
        if (error.code === 11000) {
            return res.status(400).json({ message: 'An author with this id already exists.' });
        }
        return res.status(500).json({ message: 'Unable to create author.' });
    }
};

const updateAuthorHandler = async (req, res) => {
    const { name, surname, birthYear } = req.body ?? {};
    if (![name, surname, birthYear].every(isRequiredString)) {
        return res.status(400).json({ message: 'name, surname, and birthYear are required strings.' });
    }

    const id = req.params.id;
    const author = { name, surname, birthYear };
    try {
        const result = await updateAuthor(id, author);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Author not found' });
        }
        return res.status(200).json({ id, ...author });
    } catch (error) {
        console.error('PUT /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Unable to update author.' });
    }
};

const deleteAuthorHandler = async (req, res) => {
    const id = req.params.id;
    try {
        const author = await getAuthorById(id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        if (await authorHasBooks(id)) {
            return res.status(400).json({ message: 'Author cannot be deleted while books reference it.' });
        }

        const result = await deleteAuthor(id);
        // Safeguard in case the author was deleted between the check and the delete operation
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Author not found' });
        }
        return res.status(204).end();
    } catch (error) {
        console.error('DELETE /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Unable to delete author.' });
    }
};

export {
    getAuthorsHandler,
    getAuthorByIdHandler,
    createAuthorHandler,
    updateAuthorHandler,
    deleteAuthorHandler,
};