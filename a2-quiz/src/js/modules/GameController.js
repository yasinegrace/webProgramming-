import * as api from './Fetch.js'
import { Timer } from './Timer.js'
import { HighScore } from './highScore.js'

/**
 * Class representing the controller for a quiz game.
 */
export class GameController {
  /**
   * Constructs a GameController instance.
   */
  constructor() {
    this.score = 0
    this.quizTimer = new Timer('timer-display')
    this.overallTime = new Timer('timer-display')
    this.highScoreManager = new HighScore('quizHighScores')
  }

  /**
   * Starts the game by displaying the first question and initializing game settings.
   * @param {string} nickname - The player's nickname.
   */
  async startGame(nickname) {
    console.log('Starting game for nickname:', nickname)
    this.nickname = nickname
    this.score = 0
    document.getElementById('start-section').style.display = 'none'
    document.getElementById('question-container').style.display = 'block'
    document.querySelector('.game-rules').style.display = 'block'

    try {
      const firstQuestion = await api.get('https://courselab.lnu.se/quiz/question/1')
      this.displayQuestion(firstQuestion)
    } catch (error) {
      console.error('Error fetching the first question:', error)
      document.getElementById('start-section').style.display = 'block'
      document.getElementById('question-container').style.display = 'none'
    }
  }

  /**
   * Displays a given question and sets up the UI for answering it.
   * @param {object} questionData - Data of the current question.
   * @param {boolean} [isFirstQuestion] - Flag to check if this is the first question.
   */
  displayQuestion(questionData, isFirstQuestion = false) {
    console.log('Displaying question:', questionData)
    const questionContainer = document.getElementById('question-container')
    questionContainer.innerHTML = ''
    const questionText = document.createElement('h2')
    questionText.textContent = questionData.question
    questionContainer.appendChild(questionText)

    if (questionData.alternatives) {
      for (const [key, value] of Object.entries(questionData.alternatives)) {
        const radioHTML = `<label><input type="radio" name="quiz-answer" value="${key}">${value}</label><br>`
        questionContainer.innerHTML += radioHTML
      }
    } else {
      const answerInput = document.createElement('input')
      answerInput.setAttribute('type', 'text')
      answerInput.setAttribute('id', 'answer-input')
      questionContainer.appendChild(answerInput)
    }
    const submitButton = document.createElement('button')
    submitButton.textContent = 'Submit Answer'
    submitButton.addEventListener('click', () => this.processAnswer(questionData))
    questionContainer.appendChild(submitButton)

    const questionTimeLimit = 10
    this.quizTimer.start(questionTimeLimit, () => {
      this.endQuiz('Time is up! Game over.')
    })
    if (isFirstQuestion) {
      this.overallTime.start()
    }
  }

  /**
   * Processes the player's answer and decides the next step in the game flow.
   * @param {object} questionData - Data of the current question.
   */
  async processAnswer(questionData) {
    this.quizTimer.stop()

    let answer = ''
    const selectedOption = document.querySelector('input[name="quiz-answer"]:checked')
    const textInput = document.getElementById('answer-input')
    answer = selectedOption ? selectedOption.value : textInput ? textInput.value.trim() : ''

    if (!answer) {
      alert('Please select or enter an answer')
      return
    }

    try {
      const response = await api.post(questionData.nextURL, { answer })

      if (!response.nextURL) {
        this.overallTime.stop()
        this.displayVictoryMessage()
      } else {
        this.score++
        const nextQuestion = await api.get(response.nextURL)
        this.displayQuestion(nextQuestion)
      }
    } catch (error) {
      console.error('Error submitting the answer:', error)
      this.overallTime.stop()
      this.endQuiz('Error occurred. Game over.', false)
    }
  }

  /**
   * Displays a victory message at the end of the game.
   */
  displayVictoryMessage() {
    const questionContainer = document.getElementById('question-container')
    questionContainer.innerHTML = `<h2>Congratulations, ${this.nickname}! You have completed the quiz!</h2>
                                   <p>Your score: ${this.score}</p>
                                   <p>Total time taken: ${this.quizTimer.elapsedTime().toFixed(2)} seconds</p>`
    this.highScoreManager.saveHighScore(this.nickname, this.quizTimer.elapsedTime())
    const viewHighScoresButton = document.getElementById('view-high-scores')
    viewHighScoresButton.addEventListener('click', () => {
      this.highScoreManager.displayHighScores()
    })

    const restartQuizButton = document.createElement('button')
    restartQuizButton.textContent = 'Restart Quiz'
    restartQuizButton.addEventListener('click', () => {
      this.restartQuiz()
    })
    questionContainer.appendChild(restartQuizButton)

    this.quizTimer.stop()
    this.overallTime.stop()
  }

  /**
   * Ends the quiz and displays a final message.
   * @param {string} message - The message to display at the end of the quiz.
   * @param {boolean} isCorrect - Indicates whether the final answer was correct.
   */
  endQuiz(message, isCorrect) {
    this.quizTimer.stop()
    this.overallTime.stop()

    let finalMessage = isCorrect ? 'Congratulations! ' + message : 'Incorrect answer. ' + message
    if (isCorrect) {
      const totalTime = this.overallTime.elapsedTime()
      this.highScoreManager.saveHighScore(this.nickname, totalTime)
      finalMessage += ` Your total time: ${totalTime.toFixed(2)} seconds.`
    }
    const questionContainer = document.getElementById('question-container')
    questionContainer.innerHTML = `<h2>${finalMessage}</h2>`
    this.highScoreManager.displayHighScores()
    const restartQuizButton = document.createElement('button')
    restartQuizButton.textContent = 'Restart Quiz'
    restartQuizButton.addEventListener('click', () => this.restartQuiz())
    questionContainer.appendChild(restartQuizButton)
  }

  /**
   * Restarts the quiz, resetting all necessary components.
   */
  restartQuiz() {
    this.quizTimer = new Timer('timer-display')
    document.getElementById('start-section').style.display = 'block'
    document.getElementById('question-container').style.display = 'none'
    document.getElementById('InputNickName').value = ''
  }
}
