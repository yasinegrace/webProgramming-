This project is a Node.js web application that interfaces with the GitLab API to fetch issues from a GitLab repository and display them in real-time using WebSockets. To set up and run this project, follow these steps:

Prerequisites
Node.js installed on your machine.
A GitLab account and a personal API token.


Install Dependencies
Install the required Node.js dependencies:
npm install

Configure Environment Variables

Create a .env file in the root directory of the project. Add your GitLab API token and your GitLab project ID:

GITLAB_API_TOKEN=your_gitlab_api_token_here
PROJECT_ID=your_project_id_here



Start the Application# B3 Production
Run the application using PM2 in production mode:

npm run start


