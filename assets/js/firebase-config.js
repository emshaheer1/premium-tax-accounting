/**
 * Firebase configuration for Premium Tax Accounting
 *
 * To enable Google, Facebook, and Apple sign-in:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a project or select existing one
 * 3. Enable Authentication > Sign-in method: Google, Facebook, Apple
 * 4. Copy your project config from Project settings > General > Your apps
 * 5. Replace the placeholder below with your config
 * 6. Add your site domain to Authentication > Settings > Authorized domains
 */
(function () {
  'use strict';

  var firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
  };

  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    try {
      firebase.initializeApp(firebaseConfig);
      window.ptaFirebaseAuth = firebase.auth();
    } catch (e) {
      console.warn('Firebase init failed:', e);
    }
  }
})();
