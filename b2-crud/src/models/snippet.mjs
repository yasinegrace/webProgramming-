import mongoose from '../../config/database.mjs'
/**
 * Schema definition for a snippet.
 */
const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

/**
 * Model for code snippets.
 */
const Snippet = mongoose.model('Snippet', snippetSchema)
export default Snippet
