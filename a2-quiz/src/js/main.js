import { GameController } from './modules/GameController.js'
document.addEventListener('DOMContentLoaded', () => {
  const gameController = new GameController()
  document.getElementById('start-quiz').addEventListener('click', async function () {
    console.log('Start Quiz button clicked')
    const nicknameInput = document.getElementById('InputNickName')
    const nickname = nicknameInput.value.trim()

    if (!nickname) {
      alert('Please enter your nickname!')
      return
    }

    gameController.startGame(nickname)
  })
})
