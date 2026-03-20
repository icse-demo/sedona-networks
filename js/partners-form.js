/**
 * Partners page: wire Submit to partner embedded signing flow.
 */
(function () {
  var btn = document.getElementById('btn-partner-submit');
  if (!btn) {
    return;
  }
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    if (typeof displayPartnerEmbeddedSigning === 'function') {
      displayPartnerEmbeddedSigning();
    }
  });
})();
