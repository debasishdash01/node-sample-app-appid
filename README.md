# Node.js Sample App with IBM Cloud App ID Authentication

This repository contains a simple Node.js application demonstrating how to integrate IBM Cloud App ID for user authentication. Follow this guide to set up and run the app locally, adding secure login/logout functionality with App ID.

## Prerequisites
- Node.js and npm installed
- An IBM Cloud account
- Git installed

## Setup Instructions

### 1. Clone the Repository
Clone this sample app to your local machine:
```bash
git clone https://github.com/debasishdash01/node-sample-app-appid.git
cd node-sample-app-appid
```

### 2. Install Dependencies
Install the required Node.js modules:
```bash
npm install express express-session passport ibmcloud-appid
```

These packages provide:
- `express`: Web framework
- `express-session`: Session management
- `passport`: Authentication middleware
- `ibmcloud-appid`: App ID SDK for authentication

**Optional:** If you encounter issues with older npm versions, reinitialize the project:
```bash
rm package.json package-lock.json
npm init -y
npm install express express-session passport ibmcloud-appid
```

### 3. Create an App ID Instance on IBM Cloud
1. Log in to IBM Cloud.
2. Create an App ID service:
   - Choose a region (e.g., Osaka).
   - Select the Lite plan.
   - Name your service and click **Create**.
3. From the App ID dashboard, go to **Applications > Add Application**.
   - Name your application and save.
   - Expand the application to view its credentials (`tenantId`, `clientId`, `secret`, `oauthServerUrl`).

### 4. Configure the Application
Open `app.js` and locate the WebAppStrategy configuration:
```javascript
passport.use(new WebAppStrategy({
    tenantId: "your-tenant-id",
    clientId: "your-client-id",
    secret: "your-secret",
    oauthServerUrl: "your-oauth-server-url",
    redirectUri: "http://localhost:3000" + CALLBACK_URL
}));
```
Copy the credentials from your App ID application and paste them into the code.

### 5. Whitelist Redirect URLs
1. Copy the `redirectUri` from your code (e.g., `http://localhost:3000/ibm/cloud/appid/callback`).
2. In your App ID instance:
   - Go to **Manage Authentication > Authentication Settings**.
   - Add the `redirectUri` under **Redirect URIs** and save.

### 6. Run the Application
Start the app locally:
```bash
node app.js
```
1. Open `http://localhost:3000` in your browser.
2. Test the login flow using available authentication methods (e.g., email/password or social login).
3. Log out to verify redirection to the default route.

### 7. Cleanup (Optional)
After testing, delete the App ID resource from IBM Cloud to avoid unnecessary usage.

## Troubleshooting
- **Login Error**: If login fails, ensure the `redirectUri` matches exactly in both your code and App ID settings.
- **Module Issues**: Verify dependencies with `npm list`.
- **Authentication Failure**: Check App ID credentials and network connectivity.

## References
- [IBM Cloud App ID Documentation](https://cloud.ibm.com/docs/appid)
