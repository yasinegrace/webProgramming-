/**
 * Module dependencies.
 */
import mongoose from '../../config/database.mjs'
import bcrypt from 'bcrypt'

/**
 * User schema definition.
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  }
})

/**
 * Pre-save hook to hash the password.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

/**
 * Compiles the user model.
 */
const User = mongoose.model('User', userSchema)

export default User
