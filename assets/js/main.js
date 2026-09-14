// main.js — nav behavior, click micro-animations, scroll reveal, contact form

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Sticky / scrolled header ---- */
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    function update() {
      if (window.scrollY > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---- Mobile menu toggle ---- */
  function initMobileMenu() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var open = toggle.classList.toggle('is-open');
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('is-open');
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Button press micro-animation ---- */
  function initButtonPress() {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('animationend', function () {
        btn.classList.remove('is-pressed');
      });
      btn.addEventListener('click', function () {
        if (reduceMotion) return;
        btn.classList.remove('is-pressed');
        // Force reflow so the animation can restart on rapid re-clicks.
        void btn.offsetWidth;
        btn.classList.add('is-pressed');
      });
    });
  }

  /* ---- Getting-started numbered circles: click to bounce ---- */
  function initStepCircles() {
    document.querySelectorAll('[data-step-circle]').forEach(function (circle) {
      circle.addEventListener('click', function () {
        if (reduceMotion) return;
        circle.classList.remove('is-bounced');
        void circle.offsetWidth;
        circle.classList.add('is-bounced');
      });
      circle.addEventListener('animationend', function () {
        circle.classList.remove('is-bounced');
      });
    });
  }

  /* ---- Guiding principle cards: click to reveal description ---- */
  function initPrincipleCards() {
    var cards = document.querySelectorAll('[data-principle-card]');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var isOpen = card.classList.contains('is-active');

        // Only one open at a time keeps the row calm rather than
        // turning into a wall of open text.
        cards.forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          card.classList.add('is-active');
          card.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---- FAQ accordion (version B content revision) ----
     No-op on pages with no .faq-item elements, so this is safe to run
     unconditionally on every page. Each item toggles independently. */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;
      question.addEventListener('click', function () {
        var open = item.classList.toggle('is-open');
        question.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ---- Scroll reveal ---- */
  function initScrollReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Watch a <dialog>'s `open` attribute directly, instead of its
     native "close" event. Some environments don't reliably fire that
     event for a plain programmatic close(), so every dialog on this page
     is cleaned up through this instead — one code path that works
     regardless of whether the dialog closed via a button, the backdrop,
     or the Escape key. */
  function onDialogClosed(dialog, handler) {
    new MutationObserver(function () {
      if (!dialog.open) handler();
    }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  }

  /* ---- Shared confirmation modal ----
     Both forms below pop this up on a successful submission, on top of
     their own inline "thanks" text. Returns null on browsers without
     <dialog> support so callers can skip it gracefully. */
  function initConfirmationModal() {
    var modal = document.getElementById('confirmation-modal');
    if (!modal || typeof modal.showModal !== 'function') return null;

    var titleEl = document.getElementById('confirmation-title');
    var messageEl = document.getElementById('confirmation-message');
    var closeBtn = document.getElementById('close-confirmation');
    var doneBtn = document.getElementById('confirmation-done');
    var parentModal = null;

    function close() {
      modal.close();
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (doneBtn) doneBtn.addEventListener('click', close);

    // Click on the backdrop (the dialog element itself, outside .modal__card).
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });

    // However this modal closes (button, backdrop, or Escape), close
    // whichever modal it was shown on top of, if any.
    onDialogClosed(modal, function () {
      if (parentModal && parentModal.open) parentModal.close();
      parentModal = null;
    });

    return {
      show: function (title, message, parent) {
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        parentModal = parent || null;
        modal.showModal();
      }
    };
  }

  /* ---- Contact form ----
     No backend is wired up yet — this only gives the visitor feedback.
     Replace with a real submit handler (Formspree, Netlify Forms, an API
     endpoint, etc.) before launch. See README for details. */
  function initContactForm(confirmation) {
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      status.classList.add('is-visible');
      form.reset();
      if (confirmation) {
        confirmation.show('Thanks!', "We've received your information and will be in touch soon.");
      }
    });
  }

  /* ---- Caregiver application modal ----
     No backend is wired up yet — submitting only gives the visitor
     feedback. Replace with a real submit handler before launch. See
     README for details. */
  function initApplicationModal(confirmation) {
    var openBtn = document.getElementById('open-application');
    var modal = document.getElementById('application-modal');
    var closeBtn = document.getElementById('close-application');
    var form = document.getElementById('application-form');
    var status = document.getElementById('application-status');
    if (!openBtn || !modal || !closeBtn || !form || !status) return;

    if (typeof modal.showModal !== 'function') {
      // Very old browser without <dialog> support — fall back to letting
      // the button behave as a plain no-op rather than breaking silently.
      return;
    }

    openBtn.addEventListener('click', function () {
      modal.showModal();
    });

    closeBtn.addEventListener('click', function () {
      modal.close();
    });

    // Click on the backdrop (the dialog element itself, outside .modal__card).
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.close();
    });

    onDialogClosed(modal, function () {
      status.classList.remove('is-visible');
      form.reset();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      status.classList.add('is-visible');
      if (confirmation) {
        // Pass this dialog as the "parent" so confirming closes both.
        confirmation.show('Thanks!', "We've received your application and will be in touch soon.", modal);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileMenu();
    initButtonPress();
    initStepCircles();
    initPrincipleCards();
    initFaq();
    initScrollReveal();
    var confirmation = initConfirmationModal();
    initContactForm(confirmation);
    initApplicationModal(confirmation);
  });
})();
