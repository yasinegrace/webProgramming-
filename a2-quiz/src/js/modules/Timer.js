/**
 * Timer class to handle timing functions.
 */
export class Timer {
  /**
   * Creates a Timer instance.
   * @param {string} displayElementId - The ID of the HTML element where the timer will be displayed.
   */
  constructor(displayElementId) {
    this.displayElement = document.getElementById(displayElementId)
    this.timer = null
    this.remainingTime = 0
    this.startTime = Date.now()
    if (!this.displayElement) {
      console.error(`Element with ID '${displayElementId}' not found for Timer.`)
    }
  }

  /**
   * Starts the timer with a given duration.
   * @param {number} duration - The duration for the timer in seconds.
   * @param {Function} onTimeUp - Callback function to execute when time is up.
   */
  start(duration, onTimeUp) {
    this.remainingTime = duration
    this.updateDisplay()

    this.timer = setInterval(() => {
      this.remainingTime--
      this.updateDisplay()

      if (this.remainingTime <= 0) {
        clearInterval(this.timer)
        onTimeUp()
      }
    }, 1000)
  }

  /**
   * Updates the display element with the remaining time.
   */
  updateDisplay() {
    if (this.displayElement) {
      this.displayElement.textContent = this.remainingTime + ' seconds remaining'
    }
  }

  /**
   * Stops the timer.
   */
  stop() {
    clearInterval(this.timer)
  }

  /**
   * Calculates and returns the elapsed time since the timer started.
   * @returns {number} The elapsed time in seconds.
   */
  elapsedTime() {
    if (!this.startTime) return 0
    const currentTime = Date.now()
    return (currentTime - this.startTime) / 1000
  }

  /**
   * Resets the timer to its initial state.
   */
  reset() {
    this.stop()
    this.remainingTime = 0
    this.updateDisplay()
  }
}
