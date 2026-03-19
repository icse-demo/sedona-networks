/**
 * Sedona Networks – main site script.
 * Contains: (1) Ironclad clickwrap / embedded signing – do not modify.
 *          (2) Site UI: scroll animations, password toggle, loading/success.
 */

/* --- Ironclad clickwrap: constants and iframe messaging --- */
const CLICKWRAP_IFRAME_ORIGIN = 'https://demo.ironcladapp.com';
const WORKFLOW_TEMPLATE_ID = '698e55239f0b9d55d4bffdf0';

var CLICKWRAP_ACCEPTED = false;

function sendIframeMessage(messageData) {
  const iframeInPage = document.getElementById('my-iframe');
  if (iframeInPage == null) {
    console.error('Unable to find iframe in page');
    return;
  }
  iframeInPage.contentWindow.postMessage(messageData, CLICKWRAP_IFRAME_ORIGIN);
};

function handleCWMessage(message) {
  if (message.origin !== CLICKWRAP_IFRAME_ORIGIN) {
    return;
  }

  switch (message.data.type) {
    case 'clickwrap_initialized':
      console.log("initialized");
      sendIframeMessage({
          type: 'set_data',
          data: {
              formValues: {},
              styles: {
                backgroundColor: "transparent",
                acceptanceLanguageText: {
                  fontSize: "12px",
                  fontFamily: {
                    type: "google",
                    fontFamilyName: "Open Sans",
                  },
                  fontStyle: "normal",
                  textDecoration: undefined,
                },
                documentLink: {
                  fontFamily: {
                    type: "google",
                    fontFamilyName: "Open Sans",
                  },
                  fontStyle: "normal",
                  fontSize: "12px" 
                },
              },
          },
          workflowTemplateId: WORKFLOW_TEMPLATE_ID
      });
      break;
    case 'clickwrap_is_loading':
      console.log("is loading");
      break;
    case 'clickwrap_load_succeeded':
      console.log("load succeeded");
      break;
    case 'clickwrap_load_failed':
      console.log("load failed");
      break;
    case 'clickwrap_link_clicked':
      console.log("link clicked");
      break;
    case 'clickwrap_checkbox_checked':
      console.log("checkbox checked");
      CLICKWRAP_ACCEPTED = true;
      sendIframeMessage({
        type: "send_acceptance",
        workflowTemplateId: WORKFLOW_TEMPLATE_ID,
      });
      break;
    case 'clickwrap_checkbox_unchecked':
      CLICKWRAP_ACCEPTED = false;
      console.log("checkbox unchecked");
      break;
    case 'clickwrap_acceptance_succeeded':
      console.log("acceptance succeeded");
      break;
    case 'clickwrap_acceptance_failed':
      console.log("acceptance failed");
      break;
    default:
      console.error('invalid message', { message });
  }
}

/* Attach message listener when clickwrap iframe is present and loaded. */
const iframe = document.getElementById('my-iframe');
if (iframe) {
    iframe.addEventListener("load", () => {
      window.addEventListener("message", handleCWMessage);
    });
}

/* --- Embedded signing: message handler (signature iframe) --- */
function handleMessage(message) {
  console.log(message);
  switch (message.data.type) {
    case 'load':
      console.log("signature iframe loaded");
      break;
    case 'sign':
      const submitButton = document.getElementById('submit-button');
      if (submitButton) {
        submitButton.disabled = false;
      }
      break;
    default:
      console.error('invalid message', { message });
      break;
  }
}

/* --- Loading overlay and success UI --- */

/** Starts the loading animation and rotating messages. */
function startLoading(loadingContainer, loadingMessage) {
    if (!loadingContainer || !loadingMessage) {
        console.error("Loading elements not found!");
        return;
    }
    const progressBar = document.getElementById('progress-bar');

    const totalDuration = 9500; 
    const updateFrequency = 50;  
    const increment = (updateFrequency / totalDuration) * 100; 
    let progress = 0;
    
    progressBar.style.width = '0%';
    
    let progressInterval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval); 
        }
        progressBar.style.width = progress + '%';
    }, updateFrequency);

    loadingContainer.classList.add('show');

    const messages = [
        "Dotting the i's and crossing the t's...",
        "Finalizing the legal magic...",
        "Summoning the contract gods...",
        "Making it official, just like in the movies!",
        "Printing... just kidding, it's all digital!"
    ];
    let index = 0;

    loadingMessage.innerText = messages[index];
    index = (index + 1) % messages.length;

    const messageInterval = setInterval(() => {
        loadingMessage.classList.add('fade-out');

        setTimeout(() => {
            loadingMessage.innerText = messages[index];
            loadingMessage.classList.remove('fade-out');
            index = (index + 1) % messages.length;
        }, 500); 

    }, 4000); 
}

/** Stops the loading animation and hides the overlay. */
function stopLoading(loadingContainer) {
    if (loadingContainer) {
        loadingContainer.classList.remove('show');
    }
}

function displaySuccessMessage() {
  const showToast = (msg = "Success!") => {
        const toast = document.createElement("div");
        toast.classList.add("toast-message");
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(()=> {
          toast.remove();
          window.location.href = 'success.html';
        }, 3000);
    };

   showToast("Success!");
}

/* --- Signup flow: validate, show loading, then embedded signing iframe --- */
function displayClickwrap() {
  var emailEl = document.getElementById('signup-email') || document.getElementById('email-address');
  var passwordEl = document.getElementById('password');
  var companyEl = document.getElementById('signup-company');
  var fullnameEl = document.getElementById('signup-fullname');

  var EMAIL_ADDRESS = emailEl ? emailEl.value.trim() : '';
  var PASSWORD = passwordEl ? passwordEl.value.trim() : '';

  /* Signup page: company, full name, email (no password field). */
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
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EMAIL_ADDRESS)) {
      alert('Please enter a valid email address');
      emailEl.focus();
      return;
    }
  } else if (emailEl && passwordEl) {
    /* Legacy form: email + password */
    if (!PASSWORD || !EMAIL_ADDRESS) {
      alert('Please fill in all required fields');
      if (!EMAIL_ADDRESS) {
        emailEl.focus();
      } else {
        passwordEl.focus();
      }
      return;
    }
  } else if (emailEl) {
    if (!EMAIL_ADDRESS) {
      alert('Please fill in all required fields');
      emailEl.focus();
      return;
    }
  } else {
    alert('Please fill in all required fields');
    return;
  }

  if (!CLICKWRAP_ACCEPTED) {
    alert("Please accept our terms and conditions");
    return;
  }

  const elementsToRemove = document.querySelectorAll('.card');
  elementsToRemove.forEach(function(element) {
    element.style.display = "none";
  });

  const signatureIframe = document.getElementById('signature-iframe');
  if (signatureIframe) {
      signatureIframe.addEventListener("load", () => {
        window.addEventListener("message", handleMessage);
      });
      console.log("iframe loaded");
  } else {
      console.log("iframe not yet loaded");
  }
  
  const loadingContainer = document.getElementById('loading-container');
  const loadingMessage = document.getElementById('loading-message');
  startLoading(loadingContainer, loadingMessage);

  fetch("https://customer-demo-embedded-sign-trigger-999146514905.us-west1.run.app", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              attributes: {
                  counterpartySignerEmail: "brandon.to@ironcladhq.com",
                  counterpartySignerName: "Brandon Test",
                  effectiveDate: "05/05/2026"
              },
              user: "brandon.to@ironcladhq.com",
              templateId: "698e55239f0b9d55d4bffdf0",
              frameAncestor: "https://icse-demo.github.io/", 
              roleName: "Counterparty Signer",
              clientId: "b07eab6b-bd50-4027-975f-bcb3bb4d762d",
              clientSecret: "97df9830-1ae2-4631-b02c-f4c7a01fe275",
              baseUrl: "demo.ironcladapp.com",
          }),
      })
      .then(response => {
          if (!response.ok) {
              return response.text().then(text => { throw new Error(text || 'Network response was not ok') });
          }
          return response.json();
      })
      .then(responseJSON => {
          const signatureUrl = responseJSON.url;
          console.log("Signature URL found:", signatureUrl);

          signatureIframe.src = signatureUrl;

          stopLoading(loadingContainer);
          const iframeContainer = document.getElementById('iframe-container');
          if (iframeContainer) {
              iframeContainer.style.display = "flex";
          }
      })
      .catch(error => {
          console.error("Script error:", error);
          alert(`Error: ${error.message}`);
          stopLoading(loadingContainer);
      });
}

/* After embedded signing completes, Ironclad enables #submit-button; then go to success page */
function initSignupSignatureSubmitRedirect() {
  var submitBtn = document.getElementById('submit-button');
  if (!submitBtn) {
    return;
  }
  submitBtn.addEventListener('click', function () {
    window.location.href = 'success.html';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSignupSignatureSubmitRedirect);
} else {
  initSignupSignatureSubmitRedirect();
}

/* --- Password visibility toggle (login/signup) --- */
document.addEventListener('click', function(event) {
    const eyeIcon = event.target.closest('.input-suffix.eye-icon');
    
    if (eyeIcon) {
        const passwordInput = document.getElementById('password');
        
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
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}