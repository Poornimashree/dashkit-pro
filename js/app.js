/* DashKit Pro — app.js */
(function () {
  'use strict';

  /* ── Theme ─────────────────────────────────────────────── */
  const THEME_KEY = 'dashkit_theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (theme === 'light') {
      icon.setAttribute('data-lucide', 'moon');
    } else {
      icon.setAttribute('data-lucide', 'sun');
    }
    if (window.lucide) lucide.createIcons();
  }

  function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  /* Apply on load */
  applyTheme(getTheme());

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getTheme());

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    /* ── Notification panel ─────────────────────────────── */
    const notifBtn   = document.getElementById('notifBtn');
    const notifPanel = document.getElementById('notifPanel');
    if (notifBtn && notifPanel) {
      notifBtn.addEventListener('click', e => {
        e.stopPropagation();
        notifPanel.classList.toggle('open');
      });
      document.addEventListener('click', e => {
        if (!notifPanel.contains(e.target)) {
          notifPanel.classList.remove('open');
        }
      });
    }

    /* ── User dropdown ──────────────────────────────────── */
    const userAvatar   = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');
    if (userAvatar && userDropdown) {
      userAvatar.addEventListener('click', e => {
        e.stopPropagation();
        userDropdown.classList.toggle('open');
      });
      document.addEventListener('click', e => {
        if (!userDropdown.contains(e.target)) {
          userDropdown.classList.remove('open');
        }
      });
    }

    /* ── Generic dropdown buttons ───────────────────────── */
    document.querySelectorAll('[data-dropdown]').forEach(trigger => {
      const target = document.getElementById(trigger.dataset.dropdown);
      if (!target) return;
      trigger.addEventListener('click', e => {
        e.stopPropagation();
        target.classList.toggle('open');
      });
      document.addEventListener('click', e => {
        if (!target.contains(e.target) && e.target !== trigger) {
          target.classList.remove('open');
        }
      });
    });

    /* ── Notification clear ─────────────────────────────── */
    const notifClear = document.getElementById('notifClear');
    if (notifClear) {
      notifClear.addEventListener('click', () => {
        document.querySelectorAll('.notif-item.unread').forEach(el => {
          el.classList.remove('unread');
          const dot = el.querySelector('.notif-dot-unread');
          if (dot) dot.style.visibility = 'hidden';
        });
        const dotEl = document.querySelector('#notifBtn .notif-dot');
        if (dotEl) dotEl.style.display = 'none';
      });
    }

    /* ── Toast notifications ────────────────────────────── */
    window.showToast = function (msg, type = 'success', duration = 3000) {
      let container = document.getElementById('toastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
          position:fixed; bottom:24px; right:24px;
          display:flex; flex-direction:column; gap:10px;
          z-index:9999; pointer-events:none;
        `;
        document.body.appendChild(container);
      }

      const colors = { success: '#22c55e', danger: '#ef4444', warning: '#f59e0b', info: '#38bdf8' };
      const icons  = { success: 'check-circle', danger: 'x-circle', warning: 'alert-triangle', info: 'info' };

      const toast = document.createElement('div');
      toast.style.cssText = `
        display:flex; align-items:center; gap:10px;
        background:var(--card-bg); border:1px solid var(--card-border);
        border-left:4px solid ${colors[type] || colors.info};
        border-radius:var(--radius); padding:12px 16px;
        box-shadow:var(--shadow); font-size:14px;
        color:var(--text-primary); pointer-events:all;
        animation:fadeIn .3s ease;
        min-width:260px; max-width:360px;
      `;
      toast.innerHTML = `<i data-lucide="${icons[type]}" style="width:16px;height:16px;color:${colors[type]};flex-shrink:0;"></i><span>${msg}</span>`;
      container.appendChild(toast);
      if (window.lucide) lucide.createIcons();

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity .3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    };

    /* ── Form validation helpers ────────────────────────── */
    window.validateForm = function (formEl) {
      let valid = true;
      formEl.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          valid = false;
        } else {
          input.classList.remove('error');
        }
      });
      return valid;
    };

    /* ── Settings page tabs ─────────────────────────────── */
    document.querySelectorAll('.settings-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const target = item.dataset.section;
        document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
        item.classList.add('active');
        const section = document.getElementById(target);
        if (section) section.classList.add('active');
      });
    });

    /* ── Load user from localStorage ────────────────────── */
    (function loadUser() {
      let user;
      try { user = JSON.parse(localStorage.getItem('dashkit_user') || 'null'); } catch (e) {}
      if (!user) return;

      const firstName = user.firstName || (user.name || '').split(' ')[0] || 'User';
      const lastName  = user.lastName  || (user.name || '').split(' ').slice(1).join(' ') || '';
      const fullName  = [firstName, lastName].filter(Boolean).join(' ');
      const initials  = (firstName[0] + (lastName ? lastName[0] : '')).toUpperCase();
      const email     = user.email || '';

      /* Header avatar circles */
      document.querySelectorAll('.user-avatar').forEach(el => { el.textContent = initials; });

      /* User dropdown name + email */
      document.querySelectorAll('.user-dropdown-name').forEach(el => { el.textContent = fullName; });
      document.querySelectorAll('.user-dropdown-email').forEach(el => { el.textContent = email; });

      /* Dashboard welcome span */
      const welcome = document.getElementById('welcomeName');
      if (welcome) welcome.textContent = firstName;

      /* Settings profile section */
      const pfFirst  = document.getElementById('profileFirstName');
      const pfLast   = document.getElementById('profileLastName');
      const pfEmail  = document.getElementById('profileEmail');
      const pfAvatar = document.querySelector('.avatar-large');
      if (pfFirst)  pfFirst.value  = firstName;
      if (pfLast)   pfLast.value   = lastName;
      if (pfEmail && email)  pfEmail.value  = email;
      if (pfAvatar) pfAvatar.textContent = initials;
    })();

    /* ── Table sort ─────────────────────────────────────── */
    document.querySelectorAll('thead th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const col     = th.dataset.sort;
        const table   = th.closest('table');
        const tbody   = table.querySelector('tbody');
        const rows    = Array.from(tbody.querySelectorAll('tr'));
        const thIndex = Array.from(th.parentElement.children).indexOf(th);
        const asc     = !th.classList.contains('sorted-asc');

        table.querySelectorAll('thead th').forEach(h => h.classList.remove('sorted', 'sorted-asc', 'sorted-desc'));
        th.classList.add('sorted', asc ? 'sorted-asc' : 'sorted-desc');

        rows.sort((a, b) => {
          const aText = a.children[thIndex]?.textContent.trim() || '';
          const bText = b.children[thIndex]?.textContent.trim() || '';
          return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });
        rows.forEach(r => tbody.appendChild(r));
      });
    });

    /* ── Lucide icons ───────────────────────────────────── */
    if (window.lucide) lucide.createIcons();
  });
})();
