# Social Sign-In Setup (Google, Facebook, Apple)

To make "Sign in with Google", "Sign in with Facebook", and "Sign in with Apple" work on your site, use **Firebase Authentication**.

## 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or use an existing project).
3. Follow the steps and enable Google Analytics if you want.

## 2. Get your config

1. In Firebase Console, open **Project settings** (gear icon).
2. Under **Your apps**, add a **Web** app if you haven’t (</> icon).
3. Copy the `firebaseConfig` object (apiKey, authDomain, projectId, etc.).

## 3. Enable sign-in methods

1. In the left menu, go to **Build** → **Authentication**.
2. Open the **Sign-in method** tab.
3. Enable and configure:
   - **Google**: Turn on, set support email, Save.
   - **Facebook**: Turn on, add your App ID and App Secret from [Facebook for Developers](https://developers.facebook.com/), add the OAuth redirect URI Firebase shows, Save.
   - **Apple**: Turn on, follow the Apple setup (Service ID, key, etc.) in [Apple Developer](https://developer.apple.com/). Firebase has a step-by-step guide in the console.

## 4. Add your config to the site

1. Open **assets/js/firebase-config.js**.
2. Replace the placeholder values with your own:

```javascript
var firebaseConfig = {
  apiKey: 'AIza...',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123'
};
```

3. Save the file.

## 5. Authorized domains

1. In **Authentication** → **Settings** → **Authorized domains**.
2. Add your live domain (e.g. `premiumtaxaccounting.com`).
3. `localhost` is already there for local testing.

## Result

- **Google**: User clicks “Google” → Google sign-in opens → after sign-in they are signed in on your site.
- **Facebook**: Same flow with Facebook’s login page.
- **Apple**: Same flow with Apple’s sign-in.

If Firebase is not configured, the social buttons will show: “Social sign-in is not configured. Please add your Firebase config in assets/js/firebase-config.js”.
