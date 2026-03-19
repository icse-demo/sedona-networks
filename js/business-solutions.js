(function () {
  var panel = document.getElementById('business-subscribe-panel');
  var tierSection = document.getElementById('business-tier-cards-section');
  var form = document.getElementById('business-subscribe-form');
  var selectTier = document.getElementById('biz-subscription-type');
  var backBtn = document.getElementById('business-form-back');

  if (!panel || !tierSection || !form) {
    return;
  }

  function openForm(tier) {
    if (selectTier && tier) {
      selectTier.value = tier;
    }
    tierSection.hidden = true;
    panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeForm() {
    panel.hidden = true;
    tierSection.hidden = false;
    tierSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('[data-open-business-form]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tier = btn.getAttribute('data-tier');
      openForm(tier);
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      closeForm();
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Demo only: hook your API or redirect here
  });
})();
