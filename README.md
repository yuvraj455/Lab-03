# Skills and Streaks Tracker - Project Documentation  


## Instructions  

### Part 1: Improving Our Login Functionality  

#### 1. Enhancing `Layout.hbs`  
Modify `Layout.hbs` to include conditional statements that:  
- Display `Login/Register` links when the user is anonymous.  
- Show a `Logout` link and the current user's email when authenticated.  
- Pass the `User` object back to the view in all routes that render a page.  

#### 2. Modifying Routes for User Context  

**In `Routes/streaks.js`:**  
- Update each method that renders a view to include the `User` object (all `GET` handlers, except for `delete`).  

**In `Routes/skills.js`:**  
- Ensure every method rendering a view includes the `User` object.  

**In `Routes/index.js`:**  
- Pass the `User` object in all view-rendering methods.  
- Add a `GET` handler for logout:  
  - Call `logout()` on the request object.  
  - Redirect the user to the login page.  

#### 3. Verifying Navbar Changes  
- Test the changes by navigating through the app to ensure that:  
  - Navbar displays `Login/Register` when logged out.  
  - Navbar displays the current user's email and `Logout` when logged in.  

---

### Part 2: Adding Authorization to Protect Sections of the Website  

#### 1. Checking Authorization  
While logged out, navigate to `/streaks` and `/skills` to verify that:  
- All CRUD operations are still accessible (to be restricted in the next step).  

#### 2. Securing Views  

**Approaches for view protection:**  
- Create separate views for authenticated and anonymous users.  
- Use `if-else` statements to hide/show buttons for CRUD operations.  

**In `Views/streaks/index.hbs`:**  
- Use `if-else` statements to conditionally render the `Add` button and `Actions` column.  

**In `Views/skills/index.hbs`:**  
- Use `if-else` statements to hide the `Add` button when the user is not authenticated.  

#### 3. Implementing Middleware for Route Protection  

**In `Routes/streaks.js`:**  
- Create a middleware function `isLoggedIn()` to check if the user is authenticated:  
  - Use `isAuthenticated()` from the request object.  
  - Call `next()` if authenticated; otherwise, redirect to the login page.  
- Inject this middleware into relevant route handlers (e.g., `GET /streaks/add`).  
- Test to confirm that unauthorized access is restricted.  

**Reusability:**  
- Create an `Extensions` folder and an `authentication.js` file.  
- Move the `isLoggedIn()` function to `authentication.js` and export it.  
- Import and apply this function in both `streaks.js` and `skills.js`.  

#### 4. Applying Middleware for Skills  
- Inject the `isLoggedIn()` middleware in relevant `GET` and `POST` route handlers for `/skills/add`.  

---

### Part 3: Implementing Google OAuth Authentication  

#### 1. Setting Up Google OAuth  
- Navigate to [Google Cloud Console](https://console.cloud.google.com/) and create a new project (or select an existing one).  
- Go to `APIs & Services > Credentials` and click on **Create Credentials > OAuth 2.0 Client IDs**.  

**Configure the OAuth consent screen:**  
- Application name: **Skills and Streaks Tracker**.  
- Fill out required fields and save.  

**Create the OAuth 2.0 Client ID:**  
- Authorized redirect URIs: Add `http://localhost:3000/auth/google/callback`.  
- Copy the Client ID and Client Secret and add them to your `.env` file:  
  ```plaintext
  GOOGLE_CLIENT_ID=your_google_client_id  
  GOOGLE_CLIENT_SECRET=your_google_client_secret  
  GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback  
  ```  

#### 2. Updating `globals.js`  
- Add a new `Authentication` section with a `Google` subsection:  
  - `ClientId`: Use `process.env.GOOGLE_CLIENT_ID`.  
  - `ClientSecret`: Use `process.env.GOOGLE_CLIENT_SECRET`.  
  - `CallbackUrl`: Use `process.env.GOOGLE_CALLBACK_URL`.  

#### 3. Installing Dependencies  
Install the required npm package:  
```bash  
npm i passport-google-oauth20  
```  

#### 4. Updating the Application  

**In `Models/User.js`:**  
- Add the following fields:  
  - `oauthId: String` – To record the ID received from the provider.  
  - `oauthProvider: String` – To record the provider type (e.g., Google).  
  - `created: Date` – To record the time when the user is created in the database.  

**In `App.js`:**  
- Import `globals.js` and `passport-google-oauth20`.  
- Configure the Google strategy in `passport.use()`:  
  - Use the API keys from your `.env` file.  
  - Handle new and returning users in the callback function.  

#### 5. Updating Views  

**In `Views/Login.hbs`:**  
- Add a login button with `href="/auth/google"`.  

#### 6. Adding Routes  

**In `Routes/index.js`:**  
- Add the following handlers:  
  - A `GET` handler to initiate the login process when the user clicks "Login with Google."  
  - A `GET` handler to handle the callback from Google after authentication.  

#### 7. Verifying Functionality  
- Test logging in with Google and check the user database for new entries.  
