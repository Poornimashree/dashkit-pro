/* DashKit Pro — charts.js
   All Chart.js chart definitions. Called after DOM ready.
   Reads --accent / success / warning from CSS variables.
*/
(function () {
  'use strict';

  if (typeof Chart === 'undefined') return;

  /* ── Shared helpers ─────────────────────────────────── */
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  const defaultFont = { family: "'Inter', sans-serif", size: 13 };

  Chart.defaults.font         = defaultFont;
  Chart.defaults.color        = cssVar('--text-secondary') || '#94a3b8';
  Chart.defaults.borderColor  = cssVar('--card-border')    || '#2d3148';

  function gridColor() { return cssVar('--card-border') || '#2d3148'; }
  function textColor() { return cssVar('--text-muted')  || '#64748b'; }

  const sharedScales = {
    x: {
      grid: { color: gridColor(), drawBorder: false },
      ticks: { color: textColor(), font: defaultFont }
    },
    y: {
      grid: { color: gridColor(), drawBorder: false },
      ticks: { color: textColor(), font: defaultFont },
      beginAtZero: true
    }
  };

  /* ── Generate random-ish data for demo ─────────────── */
  function rnd(min, max, len) {
    return Array.from({ length: len }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  }

  function last30Days() {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
  }

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const WEEKS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  /* ── Accent gradient helper ─────────────────────────── */
  function accentGradient(ctx, alpha1 = .45, alpha2 = .02) {
    const grad = ctx.createLinearGradient(0, 0, 0, 300);
    grad.addColorStop(0, `rgba(99,102,241,${alpha1})`);
    grad.addColorStop(1, `rgba(99,102,241,${alpha2})`);
    return grad;
  }

  /* ============================================================
     DASHBOARD CHARTS
     ============================================================ */

  /* Revenue Line Chart */
  const revenueEl = document.getElementById('revenueChart');
  if (revenueEl) {
    const ctx = revenueEl.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: last30Days(),
        datasets: [{
          label: 'Revenue ($)',
          data: rnd(4000, 18000, 30),
          borderColor: '#6366f1',
          backgroundColor: accentGradient(ctx),
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#6366f1',
          tension: .45,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#1e2130',
            borderColor: '#2d3148',
            borderWidth: 1,
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            callbacks: {
              label: ctx => ` $${ctx.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          ...sharedScales,
          x: {
            ...sharedScales.x,
            ticks: {
              ...sharedScales.x.ticks,
              maxTicksLimit: 7,
              maxRotation: 0
            }
          }
        },
        interaction: { mode: 'index', intersect: false }
      }
    });
  }

  /* Weekly Signups Bar Chart */
  const signupsEl = document.getElementById('signupsChart');
  if (signupsEl) {
    const ctx = signupsEl.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: WEEKS,
        datasets: [{
          label: 'Signups',
          data: rnd(60, 320, 7),
          backgroundColor: 'rgba(99,102,241,.7)',
          hoverBackgroundColor: '#6366f1',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e2130',
            borderColor: '#2d3148',
            borderWidth: 1,
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8'
          }
        },
        scales: sharedScales
      }
    });
  }

  /* ============================================================
     ANALYTICS CHARTS
     ============================================================ */

  /* User Growth Area Chart */
  const userGrowthEl = document.getElementById('userGrowthChart');
  if (userGrowthEl) {
    const ctx = userGrowthEl.getContext('2d');

    const growthGrad = ctx.createLinearGradient(0, 0, 0, 300);
    growthGrad.addColorStop(0, 'rgba(34,197,94,.4)');
    growthGrad.addColorStop(1, 'rgba(34,197,94,.02)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: [{
          label: 'Total Users',
          data: [1200, 1900, 2400, 3100, 4200, 5100, 6300, 7800, 9100, 10500, 12200, 14000],
          borderColor: '#22c55e',
          backgroundColor: growthGrad,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#1e2130',
          pointBorderWidth: 2,
          tension: .4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e2130',
            borderColor: '#2d3148',
            borderWidth: 1,
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8'
          }
        },
        scales: sharedScales
      }
    });
  }

  /* Traffic Sources Donut */
  const trafficEl = document.getElementById('trafficChart');
  if (trafficEl) {
    new Chart(trafficEl.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Organic', 'Direct', 'Referral', 'Social', 'Email'],
        datasets: [{
          data: [38, 24, 18, 12, 8],
          backgroundColor: ['#6366f1', '#22c55e', '#f59e0b', '#38bdf8', '#a78bfa'],
          borderColor: '#1e2130',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: defaultFont,
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 8
            }
          },
          tooltip: {
            backgroundColor: '#1e2130',
            borderColor: '#2d3148',
            borderWidth: 1,
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            callbacks: { label: c => ` ${c.label}: ${c.parsed}%` }
          }
        }
      }
    });
  }

  /* Revenue by Month Bar */
  const revenueMonthEl = document.getElementById('revenueMonthChart');
  if (revenueMonthEl) {
    const ctx = revenueMonthEl.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MONTHS,
        datasets: [
          {
            label: 'Revenue',
            data: [42000, 55000, 48000, 61000, 73000, 82000, 91000, 87000, 95000, 108000, 118000, 132000],
            backgroundColor: 'rgba(99,102,241,.7)',
            hoverBackgroundColor: '#6366f1',
            borderRadius: 5,
            borderSkipped: false
          },
          {
            label: 'Target',
            data: [50000, 60000, 55000, 65000, 78000, 85000, 95000, 90000, 100000, 110000, 120000, 130000],
            backgroundColor: 'rgba(245,158,11,.25)',
            hoverBackgroundColor: 'rgba(245,158,11,.5)',
            borderRadius: 5,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: '#94a3b8',
              font: defaultFont,
              usePointStyle: true,
              pointStyleWidth: 8
            }
          },
          tooltip: {
            backgroundColor: '#1e2130',
            borderColor: '#2d3148',
            borderWidth: 1,
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            callbacks: {
              label: c => ` ${c.dataset.label}: $${c.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: sharedScales
      }
    });
  }

  /* ── Re-create icons after charts render ──────────────── */
  if (window.lucide) lucide.createIcons();
})();
