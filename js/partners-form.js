/**
 * Partners page: wire Submit to Ironclad embedded signing (displayClickwrapEmbeddedSigning).
 */
(function () {
  var btn = document.getElementById('btn-partner-submit');
  if (!btn) {
    return;
  }
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    if (typeof displayClickwrapEmbeddedSigning === 'function') {
      displayClickwrapEmbeddedSigning();
    }
  });
})();
