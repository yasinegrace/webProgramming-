/**
 * Module dependencies.
 */
import Snippet from '../models/snippet.mjs'

/**
 * Display form to create a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const showCreateSnippetForm = (req, res) => {
  res.render('snippetForm', { user: req.session.user })
}

/**
 * Create a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const createSnippet = async (req, res) => {
  try {
    const { title, body } = req.body
    const snippet = new Snippet({
      title,
      body,
      createdBy: req.session.userId
    })
    await snippet.save()
    req.session.flashMessage = 'Snippet successfully created'
    res.redirect('/snippets')
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * Retrieve and display all snippets.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const getAllSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find().populate('createdBy', 'username')
    res.render('snippetList', { snippets, user: req.session.user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * Update a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const updateSnippet = async (req, res) => {
  try {
    const { title, body } = req.body
    const snippet = await Snippet.findByIdAndUpdate(req.params.id, { title, body }, { new: true })
    if (!snippet) {
      return res.status(404).send({ message: 'Snippet not found' })
    }
    req.session.flashMessage = 'Snippet successfully updated'
    res.redirect(`/snippets/${snippet._id}`)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

/**
 * Display form to update a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const showUpdateSnippetForm = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    if (!snippet) {
      return res.status(404).send({ message: 'Snippet not found' })
    }
    if (req.session.userId.toString() !== snippet.createdBy.toString()) {
      return res.status(403).send('Unauthorized')
    }
    res.render('editSnippet', { snippet, user: req.session.user })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

/**
 * Retrieve a snippet by its ID.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id).populate('createdBy', 'username')
    if (!snippet) {
      return res.status(404).send({ message: 'Snippet not found' })
    }
    res.render('snippetView', { snippet: snippet.toObject() })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

/**
 * Delete a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const deleteSnippet = async (req, res) => {
  try {
    const { id } = req.params
    const snippet = await Snippet.findById(id)
    if (!snippet) {
      return res.status(404).send({ message: 'Snippet not found' })
    }
    if (req.session.userId.toString() !== snippet.createdBy.toString()) {
      return res.status(403).send({ message: 'Unauthorized' })
    }
    await Snippet.findByIdAndDelete(id)
    req.session.flashMessage = 'Snippet deleted successfully'
    res.redirect('/snippets')
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: 'Error deleting snippet' })
  }
}
