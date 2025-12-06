/**
 * Class representing the Memory Game.
 */
export class MemoryGame {
  /**
   * MemoryGame constructor.
   * @param {number} rows - The number of rows in the game board.
   * @param {number} cols - The number of columns in the game board.
   * @param {string} gameInstanceId - The unique identifier for the game instance.
   */
  constructor(rows, cols, gameInstanceId) {
    this.gameInstanceId = gameInstanceId
    this.rows = rows
    this.cols = cols
    this.cards = []
    this.flippedCards = []
    this.matchedPairs = 0
    this.attempts = 0
    this.renderGameBoard()
    this.initializeGame()
  }

  /**
   * Initializes the game with a shuffled deck.
   */
  initializeGame() {
    console.log('Initializing Memory Game')
    const gameContainer = document.getElementById(this.gameInstanceId)
    if (gameContainer) {
      gameContainer.innerHTML = ''
    } else {
      console.error('Memory Game Container not found')
      return
    }
    this.cards = this.createShuffleDeck()
    this.renderGameBoard()
    console.log('Game initialized')
  }

  /**
   * Creates and shuffles the deck of cards.
   * @returns {Array} The shuffled deck of cards.
   */
  createShuffleDeck() {
    console.log('Creating and shuffling the deck')
    const totalPairs = this.rows * this.cols / 2
    const deck = []

    for (let i = 0; i < totalPairs; i++) {
      deck.push(i, i) // adding each card 2 times
    }
    return this.shuffleArray(deck)
  }

  /**
   * Shuffles the given array.
   * @param {Array} array - The array to shuffle.
   * @returns {Array} The shuffled array.
   */
  shuffleArray(array) {
    console.log('Shuffling array:', array)
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }

    return array
  }

  /**
   * Handles key press events for card navigation and flipping.
   * @param {Event} event - The key press event.
   * @param {HTMLElement} cardElement - The card element.
   * @param {number} cardId - The identifier of the card.
   */
  handleKeyPress(event, cardElement, cardId) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        this.flipCard(cardElement, cardId)
        break
      case 'ArrowRight':
        this.moveCards(cardElement, 1)
        break
      case 'ArrowLeft':
        this.moveCards(cardElement, -1)
        break
      case 'ArrowUp':
        this.moveCardsVertical(cardElement, -1)
        break
      case 'ArrowDown':
        this.moveCardsVertical(cardElement, 1)
        break
    }
  }

  /**
   * Moves the focus horizontally between cards.
   * @param {HTMLElement} currentCard - The currently focused card.
   * @param {number} direction - The direction to move (1 for right, -1 for left).
   */
  moveCards(currentCard, direction) {
    const currentIndex = this.cards.indexOf(currentCard)
    let newIndex = currentIndex + direction
    if (newIndex < 0) newIndex = this.cards.length - 1
    else if (newIndex >= this.cards.length) newIndex = 0

    this.cards[newIndex].focus()
  }

  /**
   * Moves the focus vertically between cards.
   * @param {HTMLElement} currentCard - The currently focused card.
   * @param {number} direction - The direction to move (1 for down, -1 for up).
   */
  moveCardsVertical(currentCard, direction) {
    const currentIndex = this.cards.indexOf(currentCard)
    let newIndex = currentIndex + direction * this.cols
    if (newIndex < 0) newIndex = 0
    else if (newIndex >= this.cards.length) newIndex = this.cards.length - 1

    this.cards[newIndex].focus()
  }

  /**
   * Renders the game board in the DOM.
   */
  renderGameBoard() {
    console.log('Rendering game board')
    const gameContainer = document.getElementById(this.gameInstanceId)
    if (gameContainer) {
      gameContainer.innerHTML = ''

      const boardElement = document.createElement('div')
      boardElement.className = 'memory-game-board'
      boardElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`
      boardElement.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`

      this.cards = []

      this.createShuffleDeck().forEach((cardId, index) => {
        const cardElement = document.createElement('div')
        cardElement.className = 'memory-card'
        cardElement.dataset.cardId = cardId
        cardElement.id = `card-${this.gameInstanceId}-${index}` // Uses 'index' here
        cardElement.tabIndex = 0
        cardElement.addEventListener('keydown', (event) => this.handleKeyPress(event, cardElement, cardId))

        const cardFront = document.createElement('div')
        cardFront.className = 'card-front'
        cardFront.style.backgroundImage = `url('imgs/${cardId}.png')`
        const cardBack = document.createElement('div')
        cardBack.className = 'card-back'
        cardBack.textContent = '?'
        cardElement.appendChild(cardFront)
        cardElement.appendChild(cardBack)
        cardElement.addEventListener('click', () => {
          this.flipCard(cardElement, cardId)
        })
        boardElement.appendChild(cardElement)
        this.cards.push(cardElement)
      })
      gameContainer.appendChild(boardElement)
      // Set focus on a random card keyboard navigation immediately
      if (this.cards.length > 0) {
        const randIndx = Math.floor(Math.random() * this.cards.length)
        this.cards[randIndx].focus()
      }
    } else {
      console.error('Game container not found')
    }
  }

  /**
   * Flips a card and checks for a match if two cards are flipped.
   * @param {HTMLElement} cardElement - The card element to flip.
   * @param {number} cardId - The identifier for the card.
   */
  flipCard(cardElement, cardId) {
    if (this.flippedCards.length < 2 && !cardElement.classList.contains('flipped')) {
      cardElement.classList.add('flipped')
      this.flippedCards.push({ cardElement, cardId })

      if (this.flippedCards.length === 2) {
        setTimeout(() => this.checkForMatch(), 1000)
        this.attempts++
      }
    }
  }

  /**
   * Checks if the two flipped cards match.
   */
  checkForMatch() {
    const boardElement = document.querySelector('.memory-game-board')
    boardElement.classList.add('no-click')

    setTimeout(() => {
      const [card1, card2] = this.flippedCards
      if (card1.cardId === card2.cardId) {
        this.matchedPairs++

        card1.cardElement.removeEventListener('click', this.flipCard)
        card2.cardElement.removeEventListener('click', this.flipCard)
      } else {
        card1.cardElement.classList.remove('flipped')
        card2.cardElement.classList.remove('flipped')
      }

      this.flippedCards = []

      if (this.matchedPairs === this.rows * this.cols / 2) {
        this.completeGame()
      }

      boardElement.classList.remove('no-click')
    }, 1000)
  }

  /**
   * Completes the game and shows the result.
   */
  completeGame() {
    alert(`Congratulations! You completed the game in ${this.attempts} `)
  }
}
