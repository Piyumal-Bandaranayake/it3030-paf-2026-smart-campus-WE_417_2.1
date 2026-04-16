# Authentication Module: Google OAuth2 Implementation

This guide explains the implementation of the Google OAuth2 authentication system for the Smart Campus Operations Hub.

## 1. Project Overview

We have implemented a complete authentication flow:
- **Frontend**: A modern, premium React login page that redirects users to the Google login screen.
- **Backend (Spring Boot)**: Integrated Spring Security with OAuth2 Client to manage the Google login handshake.
- **Database (MongoDB)**: Users are automatically saved or updated in a `users` collection upon successful login.

---

## 2. Backend Files (Spring Boot)

### `com.sliit.smart_campus.model.User`
- **Purpose**: Defines the User entity structure for MongoDB.
- **Fields**: `id`, `name`, `email`, `role` (default: USER), `provider` (GOOGLE), `profilePicture`, and `createdAt`.

### `com.sliit.smart_campus.repository.UserRepository`
- **Purpose**: Provides database access methods.
- **Key Method**: `findByEmail(String email)` - used to find existing users during login.

### `com.sliit.smart_campus.config.OAuth2SuccessHandler`
- **Purpose**: This is the logic that runs *after* Google confirms the user's identity.
- **Functionality**: 
  - Extracts user details (name, email, picture) from the Google profile.
  - Checks if the user exists in MongoDB.
  - Creates a new record for new users or updates details for existing ones.
  - Redirects the user back to the React frontend.

### `com.sliit.smart_campus.config.SecurityConfig`
- **Purpose**: Configures Spring Security rules.
- **Functionality**:
  - Enables OAuth2 login support.
  - Sets up CORS to allow the React frontend to communicate with the API.
  - Defines which endpoints are public (`/api/auth/**`) and which require login.

### `com.sliit.smart_campus.controller.AuthController`
- **Purpose**: Provides the `/api/auth/me` endpoint.
- **Functionality**: Returns the profile database details of the currently logged-in user.

---

## 3. Frontend Files (React)

### `src/pages/Login.jsx` & `Login.css`
- **Purpose**: A visually stunning login page built with modern web aesthetics.
- **Features**:
  - Glassmorphism UI card.
  - Animated background gradients.
  - "Continue with Google" button that initiates the OAuth flow.

### `src/App.jsx`
- **Purpose**: Updated to include the new `Login` page as the default landing route (`/`).

---

## 4. Configuration Requirements

To make this work, you **MUST** update your `.env` file in the `backend` folder:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google
FRONTEND_URL=http://localhost:3000
```

### How to get these keys:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Search for "APIs & Services" > "Credentials".
4. Create "OAuth 2.0 Client ID" with:
   - **Application Type**: Web Application.
   - **Authorized Redirect URI**: `http://localhost:8080/login/oauth2/code/google`
5. Copy the Client ID and Secret into your `.env` file.

---

## 5. Next Steps
Once the keys are added, you can start the backend and frontend. Clicking "Continue with Google" will now:
1. Redirect you to Google Login.
2. After login, Google redirects back to Spring Boot.
3. Spring Boot saves you to MongoDB.
4. Spring Boot redirects you back to the Dashboard!
