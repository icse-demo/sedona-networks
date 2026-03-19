/**
 * Mobile primary navigation: toggle panel, aria state, scroll lock, close on navigate.
 * Does not modify Ironclad / script.js behavior.
 */
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.getElementById('site-nav-toggle');
  var panel = document.getElementById('site-header-panel');

  if (!header || !toggle || !panel) {
    return;
  }

  function setOpen(open) {
    header.classList.toggle('site-nav-open', open);
    document.body.classList.toggle('site-nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function isOpen() {
    return header.classList.contains('site-nav-open');
  }

  toggle.addEventListener('click', function () {
    setOpen(!isOpen());
  });

  panel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });

  window.addEventListener('resize', function () {
    if (window.matchMedia('(min-width: 901px)').matches) {
      setOpen(false);
    }
  });
})();
