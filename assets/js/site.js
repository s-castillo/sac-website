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

  /* Forms: NO BACKEND YET. Validates, then only shows the success message; nothing is sent.
     Replace with a real submit handler before launch. */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var done = form.querySelector('.form-done');
      form.reset();
      if (done) { done.hidden = false; done.focus(); }
    });
  });
})();
