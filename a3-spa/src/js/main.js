import { MemoryGame } from './modules/memoryGame.js'
import { WindowManager } from './modules/windowManager.js'
import { chat } from './modules/chat.js'
import { TaskManager } from './modules/TaskManager.js'

document.addEventListener('DOMContentLoaded', () => {
  const windowManager = new WindowManager()
  const windows = document.querySelectorAll('.app-window')
  windows.forEach(window => {
    windowManager.setupDraggable(window)
    windowManager.setupFocus(window)
  })

  document.getElementById('memoryGameIcon').addEventListener('click', () => {
    const memoryGameWindow = document.getElementById('memoryGameWindow')
    memoryGameWindow.style.display = 'block'
    document.getElementById('sizeSelectionModal').style.display = 'block'
    document.getElementById('memoryGameParentContainer').style.display = 'none'
  })

  document.querySelectorAll('.size-btn').forEach(button => {
    button.addEventListener('click', function () {
      const rows = this.getAttribute('data-rows')
      const cols = this.getAttribute('data-cols')

      // Hide the modal
      document.getElementById('sizeSelectionModal').style.display = 'none'
      document.getElementById('memoryGameParentContainer').style.display = 'block'

      // Create a unique ID for the game instance and window
      const timestamp = Date.now()
      const gameInstanceId = `memoryGameContainer_${timestamp}`
      const memoryGameWindowId = `memoryGameWindow_${timestamp}`
      const memoryGameContent = `
            <div id="${gameInstanceId}" class="memory-game-container"></div>
        `

      // Create a new window for the memory game
      const newMemoryGameWindow = windowManager.createNewWindow('Memory Game', memoryGameContent)
      newMemoryGameWindow.id = memoryGameWindowId
      document.body.appendChild(newMemoryGameWindow)
      windowManager.openWindow(memoryGameWindowId)

      // Initialize the memory game with the selected size
      const memoryGame = new MemoryGame(parseInt(rows), parseInt(cols), gameInstanceId)
      memoryGame.initializeGame()
    })
  })

  document.getElementById('chatIcon').addEventListener('click', () => {
    const timestamp = Date.now()
    const chatWindowId = `chatWindow_${timestamp}`

    // Added div for channel selection in chatContent
    const chatContent = `
      <div id="chatSettings_${timestamp}" class="chat-settings">
        <button id="changeUsernameButton_${timestamp}">Change Username</button>
      </div>
      <div>
        <label for="channelSelect_${timestamp}">Select Channel:</label>
        <select id="channelSelect_${timestamp}">
          <option value="General">General</option>
          <option value="TechTalk">TechTalk</option>
          <option value="Random">Random</option>
        </select>
      </div>
      <div class="chat-content">
        <div id="chatMessages_${timestamp}" class="chat-messages"></div>
        <div class="chat-input-area">
          <textarea id="chatInput_${timestamp}" class="chat-input" placeholder="Type your message here..."></textarea>
          <button id="sendChatMessage_${timestamp}" class="send-chat-message">Send</button>
        </div>
      </div>
    `

    const newChatWindow = windowManager.createNewWindow('Chat', chatContent)
    newChatWindow.id = chatWindowId
    document.body.appendChild(newChatWindow)
    windowManager.openWindow(chatWindowId)

    // Initialize chat with timestamp to ensure unique IDs
    chat(timestamp)
  })

  document.getElementById('customAppIcon').addEventListener('click', () => {
    const timestamp = Date.now()
    const customAppWindowId = `customAppWindow_${timestamp}`
    const taskManagerContent = `
      <div class="task-manager-content">
        <div class="box">
          <h1>Task Manager</h1>
        </div>
        <div class="main">
          <div class="addtasks">
            <h2>Add Task</h2>
            <hr>
          </div>
          <input type="text" id="tasktext_${timestamp}" name="tasktext" placeholder="E.g: Studying 2 hours today">
          <div id="createtask_${timestamp}">
            + Create Task
          </div>
          <div class="addedtasks">
            <h2>Current Tasks</h2>
            <hr>
            <ul id="taskincomplete_${timestamp}"></ul>
          </div>
          <div class="completedtasks">
            <h2>Completed Tasks</h2>
            <hr>
            <ul id="taskcomplete_${timestamp}"></ul>
          </div>
        </div>
      </div>
    `
    const newTaskWindow = windowManager.createNewWindow('TaskWindow', taskManagerContent)
    newTaskWindow.id = customAppWindowId
    document.body.appendChild(newTaskWindow)
    windowManager.openWindow(customAppWindowId)
    const taskManager = new TaskManager(timestamp)
    taskManager.init()
  })

  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('close-button')) {
      const window = event.target.closest('.app-window')
      if (window) {
        windowManager.closeWindow(window.id)
      }
    }
  })
})
