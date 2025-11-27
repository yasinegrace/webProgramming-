import express from 'express'
import issueRoutes from './route/issueRoutes.mjs'
import wsServer from './websocket.mjs'


const app = express()

app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static('public'))


app.use('/', issueRoutes)
//app.use('/issues', issueRoutes)
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
export default (port= 5050) => {
  const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  });



// enable upgrade req on http to websocket
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request)
  })
})

}
