// Import necessary modules
import express from 'express'
import { createSnippet, getAllSnippets, getSnippetById, updateSnippet, deleteSnippet, showCreateSnippetForm, showUpdateSnippetForm } from '../controllers/snippetsController.mjs'


const router = express.Router()

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(403).send('Unauthorized')
    }
}

router.get('/create', showCreateSnippetForm)

router.post('/', isAuthenticated, createSnippet)

//  all snippets
router.get('/', getAllSnippets)

router.get('/:id/edit', isAuthenticated, showUpdateSnippetForm)
//  get a single snippet by ID
router.get('/:id', getSnippetById)

router.put('/:id', isAuthenticated, updateSnippet)

// delete a snippet by ID
router.delete('/:id', isAuthenticated, deleteSnippet)

export default router
