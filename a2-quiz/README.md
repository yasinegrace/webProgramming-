# A2 Quiz
# Add a representative image for the assignment and start with a short description of your solution.
<img src="src/img/favIcon.jpeg" alt="no image">

 The application uses the fetch API, defined in Fetch.js, to interact with the server. This includes:
# Data Retrieval:
 Using fetch to get data from the server, which is then used in files like main.js to build the user interface.
# Sending Data:
 We use fetch with POST requests to send user responses back to the server.
Timing Functions: We use setTimeout and setInterval for timing control in the quiz, such as managing the quiz timer.

# Local Storage:
 User names and scores are saved locally, allowing us to display them consistently to users.
 you need to click the Viw Hiscores button to refresh the scores 

2. Explain how a user can download and start your game.
- Clone to repo.
- "npm run build" in the terminal or git bash.
- "npm run serve" in the terminal or git bash.

3. Shortly explain the rules of the game, so the user knows how to play it.
- Enter your nick name to start the game.
- You have 10 seconds to answer each questions.
- If you fail to choose or type the right answer the game will end

Then, the
  game will automatically restart.
- If you choose or type the right answer for every question, you will win and it will display the best scores. Then,
  the game will automatically restart.

4. Explain how to execute the linters that are part of the development environment and how to execute them.
- "npm run lint" - to run the linters.
