/**
 * Sedona Networks – site UI (non-Ironclad).
 * Form validation for clickwrap flows, password toggle, scroll animations, post-signing redirect.
 */

/**
 * Validates signup / legacy email fields before Ironclad flows. Returns false if invalid (alerts + focus).
 * @returns {boolean}
 */
function validateClickwrapForm() {
  var emailEl = document.getElementById('signup-email') || document.getElementById('email-address');
  var passwordEl = document.getElementById('password');
  var companyEl = document.getElementById('signup-company');
  var fullnameEl = document.getElementById('signup-fullname');

  var EMAIL_ADDRESS = emailEl ? emailEl.value.trim() : '';
  var PASSWORD = passwordEl ? passwordEl.value.trim() : '';

  if (companyEl && fullnameEl && emailEl) {
    var company = companyEl.value.trim();
    var fullname = fullnameEl.value.trim();
    if (!company || !fullname || !EMAIL_ADDRESS) {
      alert('Please fill in all required fields');
      if (!company) {
        companyEl.focus();
      } else if (!fullname) {
        fullnameEl.focus();
      } else {
        emailEl.focus();
      }
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EMAIL_ADDRESS)) {
      alert('Please enter a valid email address');
      emailEl.focus();
      return false;
    }
  } else if (emailEl && passwordEl) {
    if (!PASSWORD || !EMAIL_ADDRESS) {
      alert('Please fill in all required fields');
      if (!EMAIL_ADDRESS) {
        emailEl.focus();
      } else {
        passwordEl.focus();
      }
      return false;
    }
  } else if (emailEl) {
    if (!EMAIL_ADDRESS) {
      alert('Please fill in all required fields');
      emailEl.focus();
      return false;
    }
  } else {
    alert('Please fill in all required fields');
    return false;
  }

  return true;
}

function displaySuccessMessage() {
  var showToast = function (msg) {
    if (msg === void 0) {
      msg = 'Success!';
    }
    var toast = document.createElement('div');
    toast.classList.add('toast-message');
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.remove();
      window.location.href = 'success.html';
    }, 3000);
  };

  showToast('Success!');
}

/** After embedded signing completes, Ironclad enables #submit-button; then go to success page */
function initSignupSignatureSubmitRedirect() {
  var submitBtn = document.getElementById('submit-button');
  if (!submitBtn) {
    return;
  }
  submitBtn.addEventListener('click', function () {
    window.location.href = 'success.html';
  });
}

/* --- Password visibility toggle (login/signup) --- */
document.addEventListener('click', function (event) {
  var eyeIcon = event.target.closest('.input-suffix.eye-icon');

  if (eyeIcon) {
    var passwordInput = document.getElementById('password');

    if (passwordInput) {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.style.color = '#8ab7e4';
      } else {
        passwordInput.type = 'password';
        eyeIcon.style.color = '';
      }
    }
  }
});

/* --- Scroll-triggered animations (home and other pages using .animate-on-scroll) --- */
function initScrollAnimations() {
  var elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) {
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

function initSiteUiReady() {
  initSignupSignatureSubmitRedirect();
  initScrollAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSiteUiReady);
} else {
  initSiteUiReady();
}
