/**
 * Class representing a window manager for handling window-like elements in a web application.
 */
export class WindowManager {
  /**
   * WindowManager constructor.
   */
  constructor() {
    this.currentZIndex = 100
    this.windowCount = 0
  }

  /**
   * Opens a window based on its ID.
   * @param {string} windowId - The ID of the window to open.
   */
  openWindow(windowId) {
    const windowElement = document.getElementById(windowId)
    if (windowElement) {
      windowElement.style.display = 'block'
      this.bringToFront(windowElement) // hello
    }
  }

  /**
   * Closes a window based on its ID.
   * @param {string} windowId - The ID of the window to close.
   */
  closeWindow(windowId) {
    const windowElement = document.getElementById(windowId)
    if (windowElement) {
      windowElement.style.display = 'none'
    }
  }

  /**
   * Creates a new window with the specified title and HTML content.
   * @param {string} windowTitle - The title for the new window.
   * @param {string} contentHtml - The HTML content for the new window.
   * @returns {HTMLElement} The newly created window element.
   */
  createNewWindow(windowTitle, contentHtml) {
    const windowId = `window_${Date.now()}`
    const newWindow = document.createElement('div')
    newWindow.id = windowId
    newWindow.className = 'app-window'
    newWindow.innerHTML = `
      <header class="window-header">
        <span>${windowTitle}</span>
        <button class="close-button">X</button>
      </header>
      <div class="window-content">${contentHtml}</div>
    `
    this.setupDraggable(newWindow)
    this.setupFocus(newWindow)

    return newWindow
  }

  /**
   * Brings a window element to the front by adjusting its z-index.
   * @param {HTMLElement} windowElement - The window element to bring to the front.
   */
  bringToFront(windowElement) {
    windowElement.style.zIndex = ++this.currentZIndex
  }

  /**
   * Sets up focus functionality for a window element.
   * When the window is clicked, it is brought to the front.
   * @param {HTMLElement} windowElement - The window element to set up focus for.
   */
  setupFocus(windowElement) {
    windowElement.addEventListener('mousedown', () => {
      this.bringToFront(windowElement)
    })
  }

  /**
   * Makes a window element draggable.
   * @param {HTMLElement} windowElement - The window element to make draggable.
   */
  setupDraggable(windowElement) {
    const header = windowElement.querySelector('.window-header')
    header.onmousedown = (downEvent) => {
      downEvent.preventDefault()

      let prevX = downEvent.clientX
      let prevY = downEvent.clientY

      document.onmousemove = (moveEvent) => {
        moveEvent.preventDefault()
        const newX = prevX - moveEvent.clientX
        const newY = prevY - moveEvent.clientY
        prevX = moveEvent.clientX
        prevY = moveEvent.clientY

        windowElement.style.top = (windowElement.offsetTop - newY) + 'px'
        windowElement.style.left = (windowElement.offsetLeft - newX) + 'px'
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
