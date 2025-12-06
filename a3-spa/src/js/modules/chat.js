/**
 * Initializes the chat functionality.
 * @param {number} timestamp - A unique identifier for the chat instance.
 */
export function chat(timestamp) {
  // const username = getUsername()
  let websocket
  let currentchannel = localStorage.getItem('chatChannel') || 'General'
  const chatInput = document.getElementById(`chatInput_${timestamp}`)
  const sendButton = document.getElementById(`sendChatMessage_${timestamp}`)
  const chatMessages = document.getElementById(`chatMessages_${timestamp}`)
  const changeUsernameButton = document.getElementById(`changeUsernameButton_${timestamp}`)
  const channelSelect = document.getElementById(`channelSelect_${timestamp}`)
  const chatServerUrl = 'wss://courselab.lnu.se/message-app/socket'
  websocket = new WebSocket(chatServerUrl)

  channelSelect.value = currentchannel
  channelSelect.addEventListener('change', function () {
    currentchannel = this.value
    localStorage.setItem('chatChannel', currentchannel)
  })
  /**
   * Display messages in the chat window.
   * @param {string} message - Message to display.
   */
  function displayMessage(message) {
    const timestamp = new Date().toLocaleTimeString()
    const messageElement = document.createElement('div')
    messageElement.innerHTML = `${timestamp} - ${message}`
    chatMessages.appendChild(messageElement)
    while (chatMessages.children.length > 20) {
      chatMessages.removeChild(chatMessages.firstChild)
    }
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  /**
   * Get or prompt for the username.
   * @returns {string} The stored or newly input username.
   */
  function getUsername() {
    let storedUsername = localStorage.getItem('chatUsername')
    if (!storedUsername) {
      storedUsername = prompt('Please enter your username for the chat:')
      localStorage.setItem('chatUsername', storedUsername)
    }
    return storedUsername
  }

  /**
   * Prompt for a new username and update it.
   */
  function changeUsername() {
    const newUsername = prompt('Please enter your new username for the chat:')
    if (newUsername && newUsername.trim() !== '') {
      localStorage.setItem('chatUsername', newUsername.trim())
      displayMessage(`Your username has been changed to ${newUsername.trim()}`)
    }
  }
  changeUsernameButton.addEventListener('click', changeUsername)

  /**
   * Send a message to the server.
   */
  function sendMessage() {
    const currentUsername = getUsername() // Fetch the latest username
    const message = chatInput.value.trim()
    if (message && websocket && websocket.readyState === WebSocket.OPEN) {
      const chatMessage = JSON.stringify({
        type: 'message',
        data: message,
        channel: currentchannel,
        username: currentUsername,
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      })
      websocket.send(chatMessage)
      displayMessage(`You: ${message}`)
      chatInput.value = ''
    }
  }

  websocket = new WebSocket(chatServerUrl)

  websocket.onopen = function () {
    displayMessage('Connected to the chat server.')
  }

  websocket.onmessage = function (event) {
    const message = JSON.parse(event.data)
    if (message.type === 'message' && message.channel === this.currentChannel) {
      displayMessage(message.username, message.data)
    }
    if (message.type !== 'heartbeat') {
      displayMessage(`Server: ${message.data}`)
    }
  }

  websocket.onclose = function () {
    displayMessage('Disconnected from the chat server.')
  }

  sendButton.addEventListener('click', sendMessage)
  chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  })
}
