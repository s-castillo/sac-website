/* Shared behavior for the site (no dependencies): the mobile menu and the forms. */
(function () {
  'use strict';

  /* Mobile menu */
  var btn = document.querySelector('[data-menu-btn]');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    var setMenu = function (open) {
      btn.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    };
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1040) setMenu(false); });
  }

  /* Forms ---------------------------------------------------------------
     Each <form data-form="NAME"> sends its answers to the Formspree address listed
     for NAME below.

     TO CONNECT A FORM: create the form at formspree.io, copy its endpoint (it looks
     like https://formspree.io/f/xxxxxxxx) and paste it between the quotes. Nothing
     else needs to change.

     While an address is blank the form sends nothing and shows the "call or email
     us" message instead of a false "thanks". */
  var FORM_ENDPOINTS = {
    contact: '',   // Contact page: "Request care information"
    careers: ''    // Careers page: "Caregiver application"
  };

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var name = form.getAttribute('data-form');
    var endpoint = FORM_ENDPOINTS[name];
    var done = form.querySelector('.form-done');
    var fail = form.querySelector('.form-error');
    var submit = form.querySelector('[type="submit"]');

    function showError() { if (fail) { fail.hidden = false; fail.focus(); } }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (done) done.hidden = true;
      if (fail) fail.hidden = true;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (!endpoint) {
        if (window.console) console.warn('Form "' + name + '" has no endpoint yet. Add its Formspree URL to FORM_ENDPOINTS in assets/js/site.js.');
        showError();
        return;
      }
      var label = submit.textContent;
      submit.disabled = true;
      submit.textContent = 'Sending…';
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          if (done) { done.hidden = false; done.focus(); }
        })
        .catch(showError)
        .then(function () { submit.disabled = false; submit.textContent = label; });
    });
  });
})();
