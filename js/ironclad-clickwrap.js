/**
 * Sedona Networks – Ironclad clickwrap + embedded signing integration.
 * Pair with js/site-ui.js on pages that use clickwrap (e.g. signup).
 */

/* --- Ironclad clickwrap: constants and iframe messaging --- */
var CLICKWRAP_IFRAME_ORIGIN = 'https://demo.ironcladapp.com';
var WORKFLOW_TEMPLATE_ID = '698e55239f0b9d55d4bffdf0';

var CLICKWRAP_ACCEPTED = false;

function sendIframeMessage(messageData) {
  var iframeInPage = document.getElementById('my-iframe');
  if (iframeInPage == null) {
    console.error('Unable to find iframe in page');
    return;
  }
  iframeInPage.contentWindow.postMessage(messageData, CLICKWRAP_IFRAME_ORIGIN);
}

function handleCWMessage(message) {
  if (message.origin !== CLICKWRAP_IFRAME_ORIGIN) {
    return;
  }

  switch (message.data.type) {
    case 'clickwrap_initialized':
      console.log('initialized');
      sendIframeMessage({
        type: 'set_data',
        data: {
          formValues: {},
          styles: {
            backgroundColor: 'transparent',
            acceptanceLanguageText: {
              fontSize: '12px',
              fontFamily: {
                type: 'google',
                fontFamilyName: 'Open Sans',
              },
              fontStyle: 'normal',
              textDecoration: undefined,
            },
            documentLink: {
              fontFamily: {
                type: 'google',
                fontFamilyName: 'Open Sans',
              },
              fontStyle: 'normal',
              fontSize: '12px',
            },
          },
        },
        workflowTemplateId: WORKFLOW_TEMPLATE_ID,
      });
      break;
    case 'clickwrap_is_loading':
      console.log('is loading');
      break;
    case 'clickwrap_load_succeeded':
      console.log('load succeeded');
      break;
    case 'clickwrap_load_failed':
      console.log('load failed');
      break;
    case 'clickwrap_link_clicked':
      console.log('link clicked');
      break;
    case 'clickwrap_checkbox_checked':
      console.log('checkbox checked');
      CLICKWRAP_ACCEPTED = true;
      sendIframeMessage({
        type: 'send_acceptance',
        workflowTemplateId: WORKFLOW_TEMPLATE_ID,
      });
      break;
    case 'clickwrap_checkbox_unchecked':
      CLICKWRAP_ACCEPTED = false;
      console.log('checkbox unchecked');
      break;
    case 'clickwrap_acceptance_succeeded':
      console.log('acceptance succeeded');
      break;
    case 'clickwrap_acceptance_failed':
      console.log('acceptance failed');
      break;
    default:
      console.error('invalid message', { message: message });
  }
}

var ironcladIframe = document.getElementById('my-iframe');
if (ironcladIframe) {
  ironcladIframe.addEventListener('load', function () {
    window.addEventListener('message', handleCWMessage);
  });
}

/* --- Embedded signing: message handler (signature iframe) --- */
function handleMessage(message) {
  console.log(message);
  switch (message.data.type) {
    case 'load':
      console.log('signature iframe loaded');
      break;
    case 'sign':
      var submitButton = document.getElementById('submit-button');
      if (submitButton) {
        submitButton.disabled = false;
      }
      break;
    default:
      console.error('invalid message', { message: message });
      break;
  }
}

/** Starts the loading animation and rotating messages (embedded signing only). */
function startLoading(loadingContainer, loadingMessage) {
  if (!loadingContainer || !loadingMessage) {
    console.error('Loading elements not found!');
    return;
  }
  var progressBar = document.getElementById('progress-bar');

  var totalDuration = 9500;
  var updateFrequency = 50;
  var increment = (updateFrequency / totalDuration) * 100;
  var progress = 0;

  progressBar.style.width = '0%';

  var progressInterval = setInterval(function () {
    progress += increment;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
    }
    progressBar.style.width = progress + '%';
  }, updateFrequency);

  loadingContainer.classList.add('show');

  var messages = [
    "Dotting the i's and crossing the t's...",
    'Finalizing the legal magic...',
    'Summoning the contract gods...',
    "Making it official, just like in the movies!",
    "Printing... just kidding, it's all digital!",
  ];
  var index = 0;

  loadingMessage.innerText = messages[index];
  index = (index + 1) % messages.length;

  var messageInterval = setInterval(function () {
    loadingMessage.classList.add('fade-out');

    setTimeout(function () {
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

var EMBEDDED_SIGN_TRIGGER_URL =
  'https://customer-demo-embedded-sign-trigger-999146514905.us-west1.run.app';

/**
 * POST to the embedded-signing trigger API; resolves with the signature iframe URL string.
 * @returns {Promise<string>}
 */
function requestEmbeddedSigningUrl() {
  return fetch(EMBEDDED_SIGN_TRIGGER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attributes: {
        counterpartySignerEmail: 'brandon.to@ironcladhq.com',
        counterpartySignerName: 'Brandon Test',
        effectiveDate: '05/05/2026',
      },
      user: 'brandon.to@ironcladhq.com',
      templateId: '698e55239f0b9d55d4bffdf0',
      frameAncestor: 'https://icse-demo.github.io/',
      roleName: 'Counterparty Signer',
      clientId: 'b07eab6b-bd50-4027-975f-bcb3bb4d762d',
      clientSecret: '97df9830-1ae2-4631-b02c-f4c7a01fe275',
      baseUrl: 'demo.ironcladapp.com',
    }),
  }).then(function (response) {
    if (!response.ok) {
      return response.text().then(function (text) {
        throw new Error(text || 'Network response was not ok');
      });
    }
    return response.json();
  }).then(function (responseJSON) {
    return responseJSON.url;
  });
}

/**
 * Clickwrap acceptance only: same validation, terms check, card hide, and signature-iframe listener setup
 */
function displayClickwrapClickToAccept() {
  if (typeof validateClickwrapForm !== 'function' || !validateClickwrapForm()) {
    return;
  }

  if (!CLICKWRAP_ACCEPTED) {
    alert('Please accept our terms and conditions');
    return;
  }

  var elementsToRemove = document.querySelectorAll('.card');
  elementsToRemove.forEach(function (element) {
    element.style.display = 'none';
  });

  var signatureIframe = document.getElementById('signature-iframe');
  if (signatureIframe) {
    signatureIframe.addEventListener('load', function () {
      window.addEventListener('message', handleMessage);
    });
    console.log('iframe loaded');
  } else {
    console.log('iframe not yet loaded');
  }

  if (typeof displaySuccessMessage === 'function') {
    displaySuccessMessage();
  } else {
    window.location.href = 'success.html';
  }
}

/**
 * Full embedded signing: validate, terms, card hide, iframe listener, loading animation, API call, show iframe.
 */
function displayClickwrapEmbeddedSigning() {
  if (typeof validateClickwrapForm !== 'function' || !validateClickwrapForm()) {
    return;
  }

  if (!CLICKWRAP_ACCEPTED) {
    alert('Please accept our terms and conditions');
    return;
  }

  var elementsToRemove = document.querySelectorAll('.card');
  elementsToRemove.forEach(function (element) {
    element.style.display = 'none';
  });

  var signatureIframe = document.getElementById('signature-iframe');
  if (signatureIframe) {
    signatureIframe.addEventListener('load', function () {
      window.addEventListener('message', handleMessage);
    });
    console.log('iframe loaded');
  } else {
    console.log('iframe not yet loaded');
  }

  var loadingContainer = document.getElementById('loading-container');
  var loadingMessage = document.getElementById('loading-message');
  startLoading(loadingContainer, loadingMessage);

  requestEmbeddedSigningUrl()
    .then(function (signatureUrl) {
      console.log('Signature URL found:', signatureUrl);

      signatureIframe.src = signatureUrl;

      stopLoading(loadingContainer);
      var iframeContainer = document.getElementById('iframe-container');
      if (iframeContainer) {
        iframeContainer.style.display = 'flex';
      }
    })
    .catch(function (error) {
      console.error('Script error:', error);
      alert('Error: ' + error.message);
      stopLoading(loadingContainer);
    });
}
