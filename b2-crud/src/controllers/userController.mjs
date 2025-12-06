import User from '../models/user.mjs'
import bcrypt from 'bcrypt'

/**
 * Renders the home page.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const home = (req, res) => {
    res.render('home')
}

/**
 * Registers a new user.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = new User({ username, password })
        const newUser = await user.save()
        req.session.user = {
            id: newUser._id,
            username: newUser.username
        }

        req.session.flashMessage = 'User created successfully. You can now log in.'

        res.redirect('/')
    } catch (error) {
        if (error.code === 11000) {
            req.session.flashMessage = 'Username already exists.';
            res.redirect('/register')
        } else {
            req.session.flashMessage = 'An error occurred. Please try again.';
            res.redirect('/register')
        }
    }
}

/**
 * Logs in a user.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id
            req.session.user = { id: user._id, username: user.username }
            req.session.flashMessage = 'Login successful.'
            res.redirect('user/profile')
        } else {
            req.session.flashMessage = 'Invalid username or password.'
            res.redirect('/login')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'An error occurred during the login process.' })
    }
}




/**
 * Logs out a user.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({ message: 'Could not log out, please try again.' })

        }

        res.redirect('/')
    })
}

/**
 * Fetches and renders user details.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const getUserDetails = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/login')
        }

        const user = await User.findById(req.session.userId)
        if (!user) {
            return res.redirect('/login')
        }

        res.render('profile', { user: user.toObject() })
    } catch (error) {
        console.error("Error fetching user details:", error)
        res.status(500).send({ message: error.message })
    }
}
