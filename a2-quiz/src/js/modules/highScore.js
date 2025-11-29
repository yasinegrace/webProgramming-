/**
 * Class representing high score management for a quiz game.
 */
export class HighScore {
  /**
   * Creates a HighScore instance.
   * @param {string} storageKey - The key used for local storage of high scores.
   */
  constructor(storageKey) {
    console.log(`HighScore constructor called with storageKey: ${storageKey}`)
    this.storageKey = storageKey
    this.initStorage()
  }

  /**
   * Initializes the high scores in local storage if not already present.
   */
  initStorage() {
    if (localStorage.getItem(this.storageKey) === null) {
      console.log(`Initializing local storage for ${this.storageKey}`)
      localStorage.setItem(this.storageKey, JSON.stringify([]))
    }
  }

  /**
   * Saves a high score and maintains the top scores list.
   * @param {string} nickname - The player's nickname.
   * @param {number} time - The player's time score.
   */
  saveHighScore(nickname, time) {
    let highScores = this.getHighScores()
    const scoreIndex = highScores.findIndex(score => score.nickname === nickname)

    if (scoreIndex !== -1) {
      if (highScores[scoreIndex].time > time) {
        highScores[scoreIndex].time = time
      }
    } else {
      highScores.push({ nickname, time })
    }

    highScores.sort((a, b) => a.time - b.time)
    highScores = highScores.slice(0, 5)
    localStorage.setItem(this.storageKey, JSON.stringify(highScores))
  }

  /**
   * Retrieves the high scores from local storage.
   * @returns {Array} An array of high score objects.
   */
  getHighScores() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || []
  }

  /**
   * Displays the high scores in the UI.
   */
  displayHighScores() {
    const highScores = this.getHighScores()
    const highScoreList = document.createElement('ul')
    highScoreList.id = 'high-score-list'

    highScores.forEach(score => {
      const listItem = document.createElement('li')
      listItem.textContent = `${score.nickname}: ${score.time.toFixed(2)} seconds`
      highScoreList.appendChild(listItem)
    })
    const existingList = document.getElementById('high-score-list')
    if (existingList) {
      existingList.parentNode.removeChild(existingList)
    }
    document.getElementById('high-score-container').appendChild(highScoreList)
  }
}
