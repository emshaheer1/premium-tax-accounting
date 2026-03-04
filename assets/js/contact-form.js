(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('contactSubmit');

  if (!form || !successEl) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('contactName');
    var email = document.getElementById('contactEmail');
    var subject = document.getElementById('contactSubject');
    var message = document.getElementById('contactMessage');

    var nameVal = name && name.value ? name.value.trim() : '';
    var emailVal = email && email.value ? email.value.trim() : '';
    var subjectVal = subject && subject.value ? subject.value.trim() : '';
    var messageVal = message && message.value ? message.value.trim() : '';

    if (!nameVal) {
      name.focus();
      name.setCustomValidity('Please enter your name.');
      name.reportValidity();
      return;
    }
    name.setCustomValidity('');

    if (!emailVal) {
      email.focus();
      email.setCustomValidity('Please enter your email.');
      email.reportValidity();
      return;
    }
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(emailVal)) {
      email.focus();
      email.setCustomValidity('Please enter a valid email address.');
      email.reportValidity();
      return;
    }
    email.setCustomValidity('');

    if (!subjectVal) {
      subject.focus();
      subject.setCustomValidity('Please select a subject.');
      subject.reportValidity();
      return;
    }
    subject.setCustomValidity('');

    if (!messageVal) {
      message.focus();
      message.setCustomValidity('Please enter your message.');
      message.reportValidity();
      return;
    }
    message.setCustomValidity('');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    // Optional: POST to Formspree or your backend. For demo we just show success.
    var formData = new FormData(form);
    var action = form.getAttribute('action') || '';
    var method = (form.getAttribute('method') || 'get').toLowerCase();

    if (action && method === 'post') {
      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (r) { return r.json(); })
        .then(function () {
          showSuccess();
        })
        .catch(function () {
          showSuccess();
        });
    } else {
      setTimeout(showSuccess, 600);
    }

    function showSuccess() {
      form.classList.add('hidden');
      successEl.classList.add('visible');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      }
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
