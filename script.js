/* =====================================================
   MLM LAW
   Site scripts: smooth anchor scrolling + WhatsApp popup chat
   ===================================================== */

/* ---------- Smooth scrolling for in-page anchors ---------- */

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {

  anchor.addEventListener('click', function (e) {

    var target = document.querySelector(this.getAttribute('href'));

    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }

  });

});

/* ---------- WhatsApp popup chat ---------- */

(function () {

  // International format, digits only: no plus sign, spaces, or dashes.
  var WHATSAPP_NUMBER = '639603079607';

  var widget = document.getElementById('waWidget');
  if (!widget) return;

  var openers = document.querySelectorAll('[data-wa-open]');
  var lastTrigger = null;
  var popup = document.getElementById('waPopup');
  var minBtn = document.getElementById('waMin');
  var form = document.getElementById('waForm');
  var input = document.getElementById('waInput');
  var timeEl = document.getElementById('waTime');
  var emojiBtn = document.getElementById('waEmojiBtn');
  var tray = document.getElementById('waEmojiTray');

  function stamp() {
    var d = new Date();
    var h = String(d.getHours()).padStart(2, '0');
    var m = String(d.getMinutes()).padStart(2, '0');
    timeEl.textContent = h + ':' + m;
  }

  function setOpen(open) {
    widget.classList.toggle('is-open', open);
    openers.forEach(function (o) { o.setAttribute('aria-expanded', String(open)); });
    popup.setAttribute('aria-hidden', String(!open));
    if (open) {
      stamp();
      setTimeout(function () { input.focus(); }, 260);
    } else {
      tray.hidden = true;
      emojiBtn.setAttribute('aria-expanded', 'false');
    }
  }

  openers.forEach(function (o) {
    o.addEventListener('click', function () {
      lastTrigger = o;
      setOpen(!widget.classList.contains('is-open'));
    });
  });

  minBtn.addEventListener('click', function () {
    setOpen(false);
    if (lastTrigger) lastTrigger.focus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && widget.classList.contains('is-open')) {
      setOpen(false);
      if (lastTrigger) lastTrigger.focus();
    }
  });

  emojiBtn.addEventListener('click', function () {
    tray.hidden = !tray.hidden;
    emojiBtn.setAttribute('aria-expanded', String(!tray.hidden));
  });

  tray.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-emoji]');
    if (!b) return;
    input.value += b.getAttribute('data-emoji');
    input.focus();
  });

  input.addEventListener('input', function () {
    form.classList.remove('wa-empty');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = input.value.trim();
    if (!msg) {
      form.classList.add('wa-empty');
      input.focus();
      return;
    }
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener');
    input.value = '';
    tray.hidden = true;
  });

})();
