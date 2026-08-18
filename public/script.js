// ===================== MOBILE NAV =====================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose = document.getElementById('drawerClose');

function openDrawer() {
  mobileDrawer.classList.add('open');
  drawerOverlay.classList.add('open');
  hamburgerBtn.classList.add('open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  mobileDrawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  hamburgerBtn.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', () => {
  mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
});
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-link').forEach(link => link.addEventListener('click', closeDrawer));

// ===================== STATUS DASHBOARD (mock system status JSON) =====================
// This simulates a JSON payload from a monitoring endpoint. It is parsed and
// rendered as readable badge cards instead of raw JSON.
function getMockStatusPayload() {
  const services = [
    { name: 'PNR Status API', key: 'pnr' },
    { name: 'Live Train Tracking', key: 'live' },
    { name: 'Fare Engine', key: 'fare' },
    { name: 'Station Data', key: 'station' },
    { name: 'Train Schedule DB', key: 'train' },
    { name: 'Booking Gateway', key: 'booking' },
  ];
  const states = ['operational', 'operational', 'operational', 'maintenance', 'down'];
  return services.map(s => ({
    ...s,
    status: states[Math.floor(Math.random() * states.length)],
    latency: Math.floor(40 + Math.random() * 220)
  }));
}

const statusStyles = {
  operational: { label: 'Operational', dot: 'bg-signal-emerald', text: 'text-signal-emerald', ring: 'border-signal-emerald/30 bg-signal-emerald/5' },
  maintenance: { label: 'Maintenance', dot: 'bg-signal-amber', text: 'text-signal-amber', ring: 'border-signal-amber/30 bg-signal-amber/5' },
  down:        { label: 'Down',        dot: 'bg-signal-red',    text: 'text-signal-red',    ring: 'border-signal-red/30 bg-signal-red/5' },
};

function renderStatusGrid(payload) {
  const grid = document.getElementById('statusGrid');
  grid.innerHTML = payload.map(item => {
    const s = statusStyles[item.status];
    return `
      <div class="rounded-2xl border ${s.ring} p-5 flex items-center justify-between">
        <div>
          <p class="text-white font-medium">${item.name}</p>
          <p class="text-xs font-mono-board text-ink-500 mt-1">${item.latency}ms latency</p>
        </div>
        <span class="flex items-center gap-2 px-3 py-1.5 rounded-full border ${s.ring} ${s.text} text-xs font-mono-board font-semibold">
          <span class="w-2 h-2 rounded-full badge-dot ${s.dot}"></span>
          ${s.label}
        </span>
      </div>`;
  }).join('');
  document.getElementById('lastChecked').textContent = new Date().toLocaleTimeString();
}

function refreshStatus() {
  const icon = document.getElementById('refreshIcon');
  icon.style.transform = 'rotate(360deg)';
  renderStatusGrid(getMockStatusPayload());
  setTimeout(() => { icon.style.transform = 'rotate(0deg)'; }, 500);
}

document.getElementById('refreshStatusBtn').addEventListener('click', refreshStatus);
refreshStatus(); // initial load

// ===================== GENERIC "JSON -> READABLE TEXT" RENDERER =====================
// Used for the real API responses (PNR / train / fare / station / live) whose
// exact shape can vary — flattens the object into clean label/value rows
// instead of dumping raw JSON.
function prettyLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function renderReadable(container, data) {
  container.innerHTML = '';
  if (data === null || data === undefined) {
    container.innerHTML = `<p class="text-sm text-ink-500">No data returned.</p>`;
    return;
  }

  const rows = [];
  function walk(obj, prefix = '') {
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => {
        if (v && typeof v === 'object') walk(v, `${prefix}[${i}] `);
        else rows.push([`${prefix}${i + 1}`, String(v)]);
      });
    } else if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([k, v]) => {
        if (v && typeof v === 'object') walk(v, `${prefix}${prettyLabel(k)} `);
        else rows.push([`${prefix}${prettyLabel(k)}`, v === null || v === '' ? '—' : String(v)]);
      });
    }
  }
  walk(data);

  if (rows.length === 0) {
    container.innerHTML = `<p class="text-sm text-ink-500">No data returned.</p>`;
    return;
  }

  const list = document.createElement('div');
  list.className = 'rounded-xl border border-ink-800 bg-ink-950 divide-y divide-ink-800 overflow-hidden';
  rows.slice(0, 40).forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'flex items-start justify-between gap-4 px-4 py-2.5 text-sm';
    row.innerHTML = `
      <span class="text-ink-500 shrink-0">${label}</span>
      <span class="text-white font-mono-board text-right break-words">${value}</span>`;
    list.appendChild(row);
  });
  container.appendChild(list);
}

function renderError(container, message) {
  container.innerHTML = `
    <div class="rounded-xl border border-signal-red/30 bg-signal-red/5 px-4 py-3 text-sm text-signal-red">
      ${message}
    </div>`;
}

// ===================== LIVE API CALLS (via our own /api proxy — no key in the browser) =====================
async function callApi(endpoint, { statusEl, resultEl, loadingLabel }) {
  statusEl.textContent = loadingLabel || 'Fetching…';
  resultEl.innerHTML = '';
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Request failed');
    statusEl.textContent = `Updated · ${new Date().toLocaleTimeString()}`;
    renderReadable(resultEl, data);
  } catch (err) {
    statusEl.textContent = 'Error';
    renderError(resultEl, err.message || 'Something went wrong. Please try again.');
  }
}

document.querySelectorAll('[data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.getAttribute('data-action');
    const statusEl = document.querySelector(`[data-status="${action}"]`);
    const resultEl = document.querySelector(`[data-result="${action}"]`);

    switch (action) {
      case 'pnr': {
        const pnr = document.getElementById('pnrInput').value.trim();
        if (!/^\d{10}$/.test(pnr)) return renderError(resultEl, 'Enter a valid 10-digit PNR number.');
        callApi(`/api/pnr/${encodeURIComponent(pnr)}`, { statusEl, resultEl });
        break;
      }
      case 'live': {
        const trainNo = document.getElementById('liveInput').value.trim();
        if (!/^\d{4,5}$/.test(trainNo)) return renderError(resultEl, 'Enter a valid train number.');
        callApi(`/api/live-train/${encodeURIComponent(trainNo)}`, { statusEl, resultEl });
        break;
      }
      case 'train': {
        const trainNo = document.getElementById('trainInput').value.trim();
        if (!/^\d{4,5}$/.test(trainNo)) return renderError(resultEl, 'Enter a valid train number.');
        callApi(`/api/train/${encodeURIComponent(trainNo)}`, { statusEl, resultEl });
        break;
      }
      case 'station': {
        const code = document.getElementById('stationInput').value.trim().toUpperCase();
        if (!code) return renderError(resultEl, 'Enter a station code.');
        callApi(`/api/station/${encodeURIComponent(code)}`, { statusEl, resultEl });
        break;
      }
      case 'fare': {
        const from = document.getElementById('fareFrom').value.trim().toUpperCase();
        const to = document.getElementById('fareTo').value.trim().toUpperCase();
        const cls = document.getElementById('fareClass').value;
        const quota = document.getElementById('fareQuota').value;
        if (!from || !to) return renderError(resultEl, 'Enter both From and To station codes.');
        const qs = new URLSearchParams({ adults: 1, children: 0, from, to, class: cls, quota }).toString();
        callApi(`/api/fare?${qs}`, { statusEl, resultEl });
        break;
      }
    }
  });
});

// ===================== CONTACT FORM (front-end only placeholder) =====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('contactMsg').textContent = 'Message sent — thanks!';
    contactForm.reset();
  });
}
