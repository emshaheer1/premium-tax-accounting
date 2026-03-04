(function () {
  'use strict';

  var AUTH_KEY = 'pta_signed_in';
  var AUTH_EMAIL_KEY = 'pta_user_email';

  function isSignedIn() {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function setSignedIn(email) {
    try {
      localStorage.setItem(AUTH_KEY, 'true');
      if (email) localStorage.setItem(AUTH_EMAIL_KEY, email);
    } catch (e) {}
  }

  function signOut() {
    try {
      if (window.ptaFirebaseAuth) {
        ptaFirebaseAuth.signOut();
      }
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_EMAIL_KEY);
    } catch (e) {}
  }

  function updateHeaderAuth() {
    var signInLink = document.getElementById('headerSignIn');
    var accountLink = document.getElementById('headerAccount');
    if (isSignedIn()) {
      if (signInLink) signInLink.style.display = 'none';
      if (accountLink) {
        accountLink.style.display = 'inline-flex';
        accountLink.href = 'account.html';
      }
    } else {
      if (signInLink) signInLink.style.display = 'inline-flex';
      if (accountLink) accountLink.style.display = 'none';
    }
  }

  var form = document.getElementById('signInForm');
  var errorEl = document.getElementById('authError');
  var submitBtn = document.getElementById('signInSubmit');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errorEl) {
        errorEl.classList.remove('visible');
        errorEl.textContent = '';
      }

      var emailInput = document.getElementById('signInEmail');
      var passwordInput = document.getElementById('signInPassword');
      var email = emailInput && emailInput.value ? emailInput.value.trim() : '';
      var password = passwordInput && passwordInput.value : '';

      if (!email) {
        showError('Please enter your email.');
        if (emailInput) emailInput.focus();
        return;
      }
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        showError('Please enter a valid email address.');
        if (emailInput) emailInput.focus();
        return;
      }
      if (!password || password.length < 6) {
        showError('Please enter your password (at least 6 characters).');
        if (passwordInput) passwordInput.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in…';
      }

      setTimeout(function () {
        setSignedIn(email);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
        }
        window.location.href = 'account.html';
      }, 800);
    });
  }

  function showError(msg) {
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    }
  }

  function onSocialSignInSuccess(user) {
    var email = (user && user.email) || (user && user.providerData && user.providerData[0] && user.providerData[0].email) || '';
    setSignedIn(email || 'signed-in@user.com');
    window.location.href = 'account.html';
  }

  function handleSocialSignIn(providerName) {
    if (errorEl) {
      errorEl.classList.remove('visible');
      errorEl.textContent = '';
    }

    var auth = window.ptaFirebaseAuth;
    if (!auth) {
      showError('Social sign-in is not configured. Please add your Firebase config in assets/js/firebase-config.js');
      return;
    }

    var provider;
    if (providerName === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (providerName === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider();
    } else if (providerName === 'apple') {
      provider = new firebase.auth.OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
    } else {
      showError('Unknown provider.');
      return;
    }

    var btn = document.getElementById('signIn' + (providerName.charAt(0).toUpperCase() + providerName.slice(1)));
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Opening…';
    }

    auth.signInWithPopup(provider)
      .then(function (result) {
        onSocialSignInSuccess(result.user);
      })
      .catch(function (err) {
        if (btn) {
          btn.disabled = false;
          btn.textContent = providerName === 'google' ? 'Google' : providerName === 'facebook' ? 'Facebook' : 'Apple';
        }
        var msg = err.message || 'Sign-in failed. Try again or use email.';
        if (err.code === 'auth/popup-blocked') msg = 'Sign-in popup was blocked. Allow popups for this site and try again.';
        if (err.code === 'auth/popup-closed-by-user') msg = 'Sign-in was cancelled.';
        if (err.code === 'auth/cancelled-popup-request') return;
        showError(msg);
      });
  }

  function checkRedirectResult() {
    var auth = window.ptaFirebaseAuth;
    if (!auth) return;
    auth.getRedirectResult()
      .then(function (result) {
        if (result && result.user) {
          onSocialSignInSuccess(result.user);
        }
      })
      .catch(function (err) {
        if (errorEl && err.code !== 'auth/cancelled-popup-request') {
          showError(err.message || 'Sign-in failed.');
        }
      });
  }

  var googleBtn = document.getElementById('signInGoogle');
  var facebookBtn = document.getElementById('signInFacebook');
  var appleBtn = document.getElementById('signInApple');
  if (googleBtn) googleBtn.addEventListener('click', function () { handleSocialSignIn('google'); });
  if (facebookBtn) facebookBtn.addEventListener('click', function () { handleSocialSignIn('facebook'); });
  if (appleBtn) appleBtn.addEventListener('click', function () { handleSocialSignIn('apple'); });

  checkRedirectResult();

  updateHeaderAuth();
  window.ptaSignOut = signOut;
  window.ptaIsSignedIn = isSignedIn;
})();
