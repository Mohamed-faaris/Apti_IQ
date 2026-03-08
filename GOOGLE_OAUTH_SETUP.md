# Google OAuth Setup Guide

This guide will help you set up Google OAuth for the Apti!Q application.

## Prerequisites
- A Google account
- Access to Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: "Apti!Q" (or your preferred name)
5. Click "Create"

### 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: Apti!Q
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip the Scopes section (click "Save and Continue")
   - Add test users if needed
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: "Web application"
   - Name: "Apti!Q Web Client"
   - Authorized JavaScript origins:
     - For development: `http://localhost:5173`
     - For production: `https://your-domain.com`
   - Authorized redirect URIs:
     - For development: `http://localhost:5173`
     - For production: `https://your-domain.com`
   - Click "Create"

5. Copy the Client ID (it will look like: `1234567890-abc123def456.apps.googleusercontent.com`)

### 4. Configure Your Application

1. Create a `.env` file in the root of your project (copy from `.env.example`)
2. Add your Google Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
   ```

### 5. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Click "Sign in with Google"
4. You should see the Google sign-in popup
5. Select your Google account
6. You should be logged in successfully!

## Features

### Login Page
- Users can sign in with their Google account
- One-tap sign-in is enabled for returning users
- Automatic role detection based on email

### Register Page
- Users can sign up with their Google account
- Default role is set to "student"
- User information is automatically populated from Google profile

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Make sure the redirect URI in your Google Cloud Console matches exactly with your application URL
- Check for trailing slashes - they must match exactly

### "Error 401: invalid_client"
- Verify your Client ID is correct in the `.env` file
- Make sure you're using the Client ID, not the Client Secret

### Google button not showing
- Check browser console for errors
- Verify the `@react-oauth/google` package is installed
- Make sure the GoogleOAuthProvider is wrapping your app in `providers.tsx`

### "This app isn't verified"
- This is normal for apps in development
- Click "Advanced" > "Go to [App Name] (unsafe)" to proceed
- For production, you'll need to verify your app with Google

## Security Notes

- Never commit your `.env` file to version control
- Keep your Client Secret secure (not used in frontend, but important for backend)
- For production, make sure to add your production domain to authorized origins
- Consider implementing backend verification of Google tokens for added security

## Production Deployment

When deploying to production:

1. Add your production domain to Google Cloud Console:
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs: `https://your-domain.com`

2. Set the environment variable in your hosting platform:
   - Vercel: Add `VITE_GOOGLE_CLIENT_ID` in Project Settings > Environment Variables
   - Netlify: Add in Site Settings > Build & Deploy > Environment
   - Other platforms: Follow their documentation for environment variables

3. Redeploy your application

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com/)
