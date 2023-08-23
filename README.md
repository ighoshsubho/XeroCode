# Xerocode Login/SignUp API

Welcome to the Xerocode Login/SignUp API! This project provides an API for user authentication and registration using various OAuth strategies such as Google and GitHub. It is built using Node.js, Express, Passport.js, MongoDB, and Redis.

## Getting Started

To get started with the Xerocode Login/SignUp API, follow these steps:

1. Clone the repo:
   ```bash
   git clone https://github.com/ighoshsubho/XeroCode.git
   ```
2. Install dependencies:
  ```bash
  cd XeroCode
  npm install
  ```
3. Configure Environment Variables:

   Dontforget to add the private key to your github app in the root folder of this repo.

   Create a .env file in the project root and add the necessary environment variables:

  ```env
  MONGODB_URI=your-mongodb-uri
  REDIS_URL=your-redis-url
  JWT_SECRET=your-jwt-secret
  GOOGLE_CLIENT_ID=your-google-client-id
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  GITHUB_CLIENT_ID=your-github-client-id
  GITHUB_CLIENT_SECRET=your-github-client-secret
  GITHUB_APP_ID=your-github-app-id
  ```
4. Start the server:
   ```bash
    npm start
   ```

The server will start on port 3000 by default.

## OAuth Strategies
The API supports OAuth authentication using Google and GitHub:

- To authenticate with Google, visit http://localhost:3000/auth/google.
- To authenticate with GitHub, visit http://localhost:3000/auth/github.

## Endpoints
- **POST /signup**: Register a new user.
- **POST /signin**: Authenticate a user.
- **GET /auth/google**: Initiate Google OAuth authentication.
- **GET /auth/github**: Initiate GitHub OAuth authentication.
- **GET /auth/google/callback**: Callback route for Google OAuth.
- **GET /auth/github/callback**: Callback route for GitHub OAuth.
- **POST /auth/validate**: Validate a token for user access.
- **POST /type/select**: Select the user type.
- **POST /type/hosting**: Select the user hosting.
- **POST /type/repo**: Fetch user repositories.

## Configuration
The configuration can be found in the config/keys.js file. Make sure to replace placeholders with your actual credentials.

Please make sure to update the placeholders in the README with actual values and provide additional information about your project, such as API usage examples and any special considerations for developers using your API.
  
