import express from 'express'
import mongoose from '../config/database.mjs'
import session from 'express-session'
import userRouter from './routes/userRoute.mjs'
import snippetsRouter from './routes/snippetRoutes.mjs'
import logger from 'morgan'
import methodOverride from 'method-override'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(logger('dev'))

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}))

app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

app.use(methodOverride('_method'))

// Serve static files from public/
app.use(express.static('public'))

app.use((req, res, next) => {
  if (req.session.flashMessage) {
    res.locals.flashMessage = req.session.flashMessage
    delete req.session.flashMessage
  }
  next()
})

app.get('/', (req, res) => {
  const user = req.session.user
  res.render('home', { user: req.session.user })
})
app.use('/User', userRouter)

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/login', (req, res) => {
  res.render('login')
})


app.use('/snippets', snippetsRouter)
// Add a logger printing out each request
app.use((req, res, next) => {
  console.log(`Got ${req.method} request on ${req.url}`)
  next()
})

app.get('/error', (req, res) => {
  throw new Error('Simulate a 500')
})

// 404 handler goes after all valid routes
app.use((req, res, next) => {
  res.status(404).send("Not Found!")
})

// Error handler goes last
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Get the port number from the environment or use 3000 as default
export default (port = process.env.PORT || 3000) => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}
