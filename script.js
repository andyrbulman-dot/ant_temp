/* O-Reg Thermal — the only two things on this site that need scripting. */

(function () {
  'use strict';

  // ---- the small-screen menu ----------------------------------------------
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.querySelector('.label').textContent = open ? 'Close' : 'Menu';
    });
    // A tap on a link should close it, or the page underneath is never seen.
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('.label').textContent = 'Menu';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { btn.click(); btn.focus(); }
    });
  }

  // ---- the enquiry form ----------------------------------------------------
  // There is no server behind these pages, so rather than a form that silently
  // goes nowhere, this opens the visitor's own email with everything they typed
  // already in it. They can see exactly what is being sent, and it arrives from
  // their real address, which makes replying straightforward.
  var form = document.getElementById('enquiry');
  if (!form) return;

  var TO = ['O.reg.thermal', 'gmail.com'].join('@');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    var name = v('f-name'), email = v('f-email');
    var note = document.getElementById('formNote');

    if (!name || !email) {
      note.textContent = 'Please fill in your name and email so we can reply.';
      note.style.color = '#d9541f';
      (name ? document.getElementById('f-email') : document.getElementById('f-name')).focus();
      return;
    }

    var lines = [
      'Name:            ' + name,
      'Email:           ' + email,
      'Company:         ' + (v('f-company') || '—'),
      'Phone:           ' + (v('f-phone') || '—'),
      '',
      'Service:         ' + (v('f-service') || '—'),
      'Project:         ' + (v('f-project') || '—'),
      'Dwellings/units: ' + (v('f-units') || '—'),
      'Needed by:       ' + (v('f-when') || '—'),
      '',
      'Details',
      '-------',
      v('f-message') || '(none given)',
      ''
    ];

    var subject = 'Enquiry: ' + (v('f-service') || 'Part O assessment') +
                  (v('f-project') ? ' — ' + v('f-project') : '');

    var link = 'mailto:' + TO +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));

    // Some browsers refuse to follow a mailto: from script, and the visitor is
    // left staring at a form that appears to have done nothing. So the same
    // link is put on the page as something they can click themselves.
    var fallback = document.getElementById('mailFallback');
    fallback.href = link;
    fallback.hidden = false;

    note.textContent = 'Your email program should be opening, with everything filled in — ' +
                       'attach the drawings there and send. If nothing happened:';
    note.style.color = '';

    window.location.href = link;
  });
})();
