/* DashKit Pro — sidebar.js */
(function () {
  'use strict';

  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const toggle   = document.getElementById('sidebarToggle');

  if (!sidebar) return;

  const COLLAPSED_KEY = 'dashkit_sidebar_collapsed';
  const isMobile = () => window.innerWidth <= 768;

  /* Restore state on load */
  if (!isMobile() && localStorage.getItem(COLLAPSED_KEY) === '1') {
    sidebar.classList.add('collapsed');
  }

  function openMobile() {
    sidebar.classList.add('mobile-open');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function toggleDesktop() {
    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem(COLLAPSED_KEY, isCollapsed ? '1' : '0');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (isMobile()) {
        sidebar.classList.contains('mobile-open') ? closeMobile() : openMobile();
      } else {
        toggleDesktop();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobile);
  }

  /* Close on resize past breakpoint */
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      closeMobile();
    }
  });

  /* Highlight active nav item */
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href') || '';
    if (href && href.includes(currentPage)) {
      item.classList.add('active');
    }
  });
})();
