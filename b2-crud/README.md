# B2 CRUD Application for Code Snippets

## Getting Started

This application is a CRUD web platform for managing programming code snippets. It's built using Node.js and Express for the server-side logic, with MongoDB for the database, managed through Mongoose for data modeling. It supports user functionalities like registration, login/logout, and session management for authentication and authorization purposes.

To kickstart the application, ensure you have Node.js and docker installed on your machine. Then follow these commands:

```bash
# Install dependencies
npm install

# Run the application (make sure MongoDB is running)
npx nodemon app.mjs

# Description

The B2 CRUD application is designed to help users store, update, retrieve, and delete code snippets effectively, adhering to the MVC design pattern for organized code structure. While anonymous users can view snippets, registered users have the added capability to create, edit, and manage their snippets, providing a comprehensive platform for code snippet management.

# Database Configuration
For database connectivity and setup, refer to the config/database.mjs file, which contains all necessary configuration details. Ensure to adjust the connection string according to your MongoDB setup to establish a successful connection
