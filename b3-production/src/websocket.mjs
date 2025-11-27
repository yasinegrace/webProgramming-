import { WebSocketServer, WebSocket } from 'ws'
//import WebSocket from 'ws';

/**
 * Create a new WebSocket server instance that does not handle HTTP requests directly.
 */
const wsServer = new WebSocketServer({
  noServer: true,
  clientTracking: true
})

/**
 * Broadcasts a message to all connected clients except the sender.
 * 
 * @param {WebSocket} sender - The WebSocket connection of the sender.
 * @param {Object} messageObject - The message object to be sent.
 */
wsServer.broadcastExceptSelf = (sender, messageObject) => {
  let clients = 0
  const messageString = JSON.stringify(messageObject)

  wsServer.clients.forEach(client => {
    if (client !== sender && client.readyState === client.OPEN) {
      clients++
      client.send(messageString)
    }
  })
}

/**
 * Set up event listeners for the WebSocket server.
 */
wsServer.on('connection', ws => {
  console.log('Connection received')

  const connectionNotification = {
    type: "connection-notification",
    content: `New client connected (${wsServer.clients.size}).`
  }
  wsServer.broadcastExceptSelf(ws, connectionNotification)

  ws.on('message', messageString => {
    try {
      const messageObject = JSON.parse(messageString)
      console.log('Received message:', messageObject)
      wsServer.broadcastExceptSelf(ws, messageObject)
    } catch (error) {
      console.error('Failed to parse message as JSON:', messageString, error)
    }
  })

  ws.on('close', () => console.info('Client closed connection'))

  ws.on('error', console.error)
})

export default wsServer
