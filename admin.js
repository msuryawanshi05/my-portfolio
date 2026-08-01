// Clerk Publishable Key
const CLERK_PUBLISHABLE_KEY = window.CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder_key';

let clerk = null;

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  const targetContent = document.getElementById(tabId);
  if (targetContent) targetContent.classList.add('active');

  const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(
    btn => btn.getAttribute('onclick').includes(tabId)
  );
  if (activeBtn) activeBtn.classList.add('active');
}

async function getAuthHeader() {
  if (!clerk || !clerk.session) return {};
  const token = await clerk.session.getToken();
  return { 'Authorization': `Bearer ${token}` };
}

// Universal Toggle Component Helper
async function toggleResourceShow(resourcePath, id, currentState, reloadFn) {
  try {
    const headers = await getAuthHeader();
    headers['Content-Type'] = 'application/json';

    const res = await fetch(`/api/${resourcePath}/${id}/toggle-show`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ show: !currentState })
    });

    if (res.ok) {
      await reloadFn();
    } else {
      alert(`Failed to toggle visibility for ${resourcePath} #${id}`);
      await reloadFn();
    }
  } catch (err) {
    console.error(`Toggle error for ${resourcePath}:`, err);
    await reloadFn();
  }
}

async function initAdmin() {
  const authView = document.getElementById('auth-view');
  const dashboardView = document.getElementById('dashboard-view');
  const authMessage = document.getElementById('auth-message');

  try {
    clerk = new window.Clerk(CLERK_PUBLISHABLE_KEY);
    await clerk.load();

    if (!clerk.user) {
      authView.style.display = 'block';
      dashboardView.style.display = 'none';
      clerk.mountSignIn(document.getElementById('clerk-sign-in'));
      return;
    }

    // Authenticated
    document.getElementById('user-identity').textContent =
      clerk.user.primaryEmailAddress?.emailAddress || clerk.user.id;
    
    authView.style.display = 'none';
    dashboardView.style.display = 'block';

    document.getElementById('btn-sign-out')?.addEventListener('click', () => {
      clerk.signOut().then(() => window.location.reload());
    });

    // Load initial dashboard data
    await loadDashboardData();

  } catch (err) {
    console.error('Clerk Initialization Error:', err);
    if (authMessage) {
      authMessage.textContent = 'Please configure CLERK_PUBLISHABLE_KEY in admin.js or environment.';
    }
  }
}

async function loadDashboardData() {
  await Promise.all([
    loadProjects(),
    loadCerts(),
    loadSkills(),
    loadStats(),
    loadTimeline()
  ]);
}

// =============================================================================
// 1. PROJECTS (WITH GITHUB SYNC & TOGGLE)
// =============================================================================
async function loadProjects() {
  try {
    const res = await fetch('/api/projects?admin=true');
    const projects = await res.json();
    const tbody = document.getElementById('list-projects');
    tbody.innerHTML = '';

    projects.forEach(p => {
      const tr = document.createElement('tr');
      const customBadge = p.is_customized
        ? `<span class="badge-custom badge-edited" title="Manually edited — GitHub sync won't overwrite custom text">Edited</span>`
        : `<span class="badge-custom badge-auto">GitHub</span>`;

      tr.innerHTML = `
        <td>
          <label class="switch">
            <input type="checkbox" ${p.show ? 'checked' : ''} onchange="toggleResourceShow('projects', '${p.id}', ${p.show}, loadProjects)">
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <strong>${p.name || p.id}</strong><br/>
          <small style="color:var(--text-muted);">ID: ${p.id}</small>
        </td>
        <td>
          <a href="${p.github}" target="_blank" style="color:var(--cyan);">${p.github}</a>
          ${p.live ? `<br/><a href="${p.live}" target="_blank" style="color:var(--purple-l);">${p.live}</a>` : ''}
        </td>
        <td><code>${p.language || '-'}</code></td>
        <td>${customBadge}</td>
        <td>
          <button class="btn-sm" onclick="editProject('${p.id}', '${encodeURIComponent(p.name||'')}', '${encodeURIComponent(p.github||'')}', '${encodeURIComponent(p.live||'')}', '${encodeURIComponent(p.description||'')}', '${encodeURIComponent(p.language||'')}')">Edit</button>
          <button class="btn-sm btn-danger" onclick="deleteProject('${p.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('Failed to load projects:', e);
  }
}

document.getElementById('btn-sync-github')?.addEventListener('click', async () => {
  const btn = document.getElementById('btn-sync-github');
  btn.disabled = True;
  btn.textContent = '🔄 Syncing...';

  try {
    const headers = await getAuthHeader();
    const res = await fetch('/api/projects/sync', { method: 'POST', headers });
    if (res.ok) {
      const repos = await res.json();
      alert(`GitHub sync completed! ${repos.length} repositories synced.`);
      await loadProjects();
    } else {
      const err = await res.json();
      alert(`GitHub sync failed: ${err.detail || res.statusText}`);
    }
  } catch (err) {
    console.error('Sync error:', err);
    alert('GitHub sync failed');
  } finally {
    btn.disabled = False;
    btn.textContent = '🔄 Sync from GitHub';
  }
});

function editProject(id, name, github, live, desc, lang) {
  document.getElementById('proj-id').value = id;
  document.getElementById('proj-name').value = decodeURIComponent(name);
  document.getElementById('proj-github').value = decodeURIComponent(github);
  document.getElementById('proj-live').value = decodeURIComponent(live);
  document.getElementById('proj-desc').value = decodeURIComponent(desc);
  document.getElementById('proj-lang').value = decodeURIComponent(lang);
}

document.getElementById('form-project')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const headers = await getAuthHeader();
  headers['Content-Type'] = 'application/json';

  const id = document.getElementById('proj-id').value.trim();
  const body = {
    id: id,
    name: document.getElementById('proj-name').value.trim(),
    github: document.getElementById('proj-github').value.trim(),
    live: document.getElementById('proj-live').value.trim(),
    description: document.getElementById('proj-desc').value.trim(),
    language: document.getElementById('proj-lang').value.trim()
  };

  // Try PUT first, fallback to POST if new
  let res = await fetch(`/api/projects/${id}`, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (res.status === 404) {
    res = await fetch('/api/projects', { method: 'POST', headers, body: JSON.stringify(body) });
  }

  if (res.ok) {
    document.getElementById('form-project').reset();
    await loadProjects();
  } else {
    const err = await res.json();
    alert(`Failed to save project: ${err.detail || res.statusText}`);
  }
});

async function deleteProject(id) {
  if (!confirm(`Delete project '${id}'?`)) return;
  const headers = await getAuthHeader();
  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers });
  if (res.ok) await loadProjects();
  else alert('Failed to delete project');
}

// =============================================================================
// 2. CERTIFICATES (WITH TOGGLE)
// =============================================================================
async function loadCerts() {
  try {
    const res = await fetch('/api/certs?admin=true');
    const certs = await res.json();
    const tbody = document.getElementById('list-certs');
    tbody.innerHTML = '';

    certs.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <label class="switch">
            <input type="checkbox" ${c.show ? 'checked' : ''} onchange="toggleResourceShow('certs', ${c.id}, ${c.show}, loadCerts)">
            <span class="slider"></span>
          </label>
        </td>
        <td>${c.id}</td>
        <td><strong>${c.label}</strong></td>
        <td><code>${c.file}</code></td>
        <td>
          <button class="btn-sm btn-danger" onclick="deleteCert(${c.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('Failed to load certs:', e);
  }
}

document.getElementById('form-cert')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const headers = await getAuthHeader();
  headers['Content-Type'] = 'application/json';

  const body = {
    label: document.getElementById('cert-label').value.trim(),
    file: document.getElementById('cert-file').value.trim(),
    show: document.getElementById('cert-show').value === 'true'
  };

  const res = await fetch('/api/certs', { method: 'POST', headers, body: JSON.stringify(body) });
  if (res.ok) {
    document.getElementById('form-cert').reset();
    await loadCerts();
  } else {
    alert('Failed to add certificate');
  }
});

async function deleteCert(id) {
  if (!confirm(`Delete cert #${id}?`)) return;
  const headers = await getAuthHeader();
  const res = await fetch(`/api/certs/${id}`, { method: 'DELETE', headers });
  if (res.ok) await loadCerts();
  else alert('Failed to delete cert');
}

// =============================================================================
// 3. SKILLS & RADAR (WITH TOGGLE)
// =============================================================================
async function loadSkills() {
  try {
    const res = await fetch('/api/skills/list?admin=true');
    const skills = await res.json();
    const tbody = document.getElementById('list-skills');
    tbody.innerHTML = '';

    skills.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <label class="switch">
            <input type="checkbox" ${s.show ? 'checked' : ''} onchange="toggleResourceShow('skills', ${s.id}, ${s.show}, loadSkills)">
            <span class="slider"></span>
          </label>
        </td>
        <td>${s.id}</td>
        <td><span class="soc-tag">${s.category.toUpperCase()}</span></td>
        <td><strong>${s.name}</strong></td>
        <td>
          <button class="btn-sm btn-danger" onclick="deleteSkill(${s.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Load Radar Scores
    const resRadar = await fetch('/api/skills');
    const dataRadar = await resRadar.json();

    const grid = document.getElementById('radar-inputs-grid');
    grid.innerHTML = '';

    dataRadar.radar.forEach(r => {
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label>${r.label}</label>
        <input type="number" class="form-control radar-val-input" data-label="${r.label}" value="${r.value}" min="0" max="100" />
      `;
      grid.appendChild(div);
    });

  } catch (e) {
    console.error('Failed to load skills:', e);
  }
}

document.getElementById('form-skill')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const headers = await getAuthHeader();
  headers['Content-Type'] = 'application/json';

  const body = {
    category: document.getElementById('skill-category').value,
    name: document.getElementById('skill-name').value.trim(),
    show: True
  };

  const res = await fetch('/api/skills', { method: 'POST', headers, body: JSON.stringify(body) });
  if (res.ok) {
    document.getElementById('skill-name').value = '';
    await loadSkills();
  } else {
    alert('Failed to add skill');
  }
});

document.getElementById('form-radar')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const headers = await getAuthHeader();
  headers['Content-Type'] = 'application/json';

  const items = Array.from(document.querySelectorAll('.radar-val-input')).map(inp => ({
    label: inp.getAttribute('data-label'),
    value: parseInt(inp.value, 10)
  }));

  const res = await fetch('/api/skills/radar', { method: 'PUT', headers, body: JSON.stringify(items) });
  if (res.ok) alert('Radar scores updated!');
  else alert('Failed to update radar scores');
});

async function deleteSkill(id) {
  if (!confirm(`Delete skill #${id}?`)) return;
  const headers = await getAuthHeader();
  const res = await fetch(`/api/skills/${id}`, { method: 'DELETE', headers });
  if (res.ok) await loadSkills();
  else alert('Failed to delete skill');
}

// =============================================================================
// 4. DYNAMIC STAT TILES (WITH TOGGLE)
// =============================================================================
async function loadStats() {
  try {
    const res = await fetch('/api/stats?admin=true');
    const tiles = await res.json();
    const tbody = document.getElementById('list-stats');
    tbody.innerHTML = '';

    tiles.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <label class="switch">
            <input type="checkbox" ${t.show ? 'checked' : ''} onchange="toggleResourceShow('stats', ${t.id}, ${t.show}, loadStats)">
            <span class="slider"></span>
          </label>
        </td>
        <td><code>${t.order}</code></td>
        <td><strong>${t.label}</strong></td>
        <td><span style="color:var(--cyan); font-weight:bold;">${t.value}</span></td>
        <td>${t.icon_or_symbol || '-'} ${t.link_url ? `<a href="${t.link_url}" target="_blank" style="color:var(--purple-l);">[link]</a>` : ''}</td>
        <td>
          <button class="btn-sm" onclick="editStatTile(${t.id}, '${encodeURIComponent(t.label)}', '${encodeURIComponent(t.value)}', '${encodeURIComponent(t.icon_or_symbol||'')}', '${encodeURIComponent(t.link_url||'')}', ${t.order})">Edit</button>
          <button class="btn-sm btn-danger" onclick="deleteStatTile(${t.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('Failed to load stat tiles:', e);
  }
}

function editStatTile(id, label, value, symbol, link, order) {
  document.getElementById('stat-tile-id').value = id;
  document.getElementById('stat-tile-label').value = decodeURIComponent(label);
  document.getElementById('stat-tile-value').value = decodeURIComponent(value);
  document.getElementById('stat-tile-symbol').value = decodeURIComponent(symbol);
  document.getElementById('stat-tile-link').value = decodeURIComponent(link);
  document.getElementById('stat-tile-order').value = order;
}

document.getElementById('form-stat-tile')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const headers = await getAuthHeader();
  headers['Content-Type'] = 'application/json';

  const tileId = document.getElementById('stat-tile-id').value;
  const body = {
    label: document.getElementById('stat-tile-label').value.trim(),
    value: document.getElementById('stat-tile-value').value.trim(),
    icon_or_symbol: document.getElementById('stat-tile-symbol').value.trim(),
    link_url: document.getElementById('stat-tile-link').value.trim(),
    order: parseInt(document.getElementById('stat-tile-order').value, 10) || 0,
    show: True
  };

  let res;
  if (tileId) {
    res = await fetch(`/api/stats/${tileId}`, { method: 'PUT', headers, body: JSON.stringify(body) });
  } else {
    res = await fetch('/api/stats', { method: 'POST', headers, body: JSON.stringify(body) });
  }

  if (res.ok) {
    document.getElementById('form-stat-tile').reset();
    document.getElementById('stat-tile-id').value = '';
    await loadStats();
  } else {
    alert('Failed to save stat tile');
  }
});

async function deleteStatTile(id) {
  if (!confirm(`Delete stat tile #${id}?`)) return;
  const headers = await getAuthHeader();
  const res = await fetch(`/api/stats/${id}`, { method: 'DELETE', headers });
  if (res.ok) await loadStats();
  else alert('Failed to delete stat tile');
}

// =============================================================================
// 5. INCIDENT TIMELINE / EXPERIENCE (WITH TOGGLE)
// =============================================================================
async function loadTimeline() {
  try {
    const res = await fetch('/api/experience?admin=true');
    const entries = await res.json();
    const tbody = document.getElementById('list-timeline');
    tbody.innerHTML = '';

    entries.forEach(e => {
      const tr = document.createElement('tr');
      const dateRange = e.date_end ? `${e.date_start} / ${e.date_end}` : `${e.date_start} / Present`;
      const descSnippet = e.description.length > 70 ? e.description.slice(0, 70) + '...' : e.description;

      tr.innerHTML = `
        <td>
          <label class="switch">
            <input type="checkbox" ${e.show ? 'checked' : ''} onchange="toggleResourceShow('experience', ${e.id}, ${e.show}, loadTimeline)">
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <strong>${e.title}</strong><br/>
          <small style="color:var(--text-muted);">${e.organization}</small>
        </td>
        <td><span class="soc-tag">${e.tag}</span></td>
        <td><code>${dateRange}</code></td>
        <td style="font-size:0.8rem; color:var(--text-muted);">${descSnippet}</td>
        <td>
          <button class="btn-sm" onclick="editTimeline(${e.id}, '${encodeURIComponent(e.title)}', '${encodeURIComponent(e.organization)}', '${encodeURIComponent(e.tag)}', '${encodeURIComponent(e.date_start)}', '${encodeURIComponent(e.date_end||'')}', '${encodeURIComponent(e.description)}')">Edit</button>
          <button class="btn-sm btn-danger" onclick="deleteTimeline(${e.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load timeline:', err);
  }
}

function editTimeline(id, title, org, tag, start, end, desc) {
  document.getElementById('exp-id').value = id;
  document.getElementById('exp-title').value = decodeURIComponent(title);
  document.getElementById('exp-org').value = decodeURIComponent(org);
  document.getElementById('exp-tag').value = decodeURIComponent(tag);
  document.getElementById('exp-start').value = decodeURIComponent(start);
  document.getElementById('exp-end').value = decodeURIComponent(end);
  document.getElementById('exp-desc').value = decodeURIComponent(desc);
}

document.getElementById('form-timeline')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const headers = await getAuthHeader();
  headers['Content-Type'] = 'application/json';

  const expId = document.getElementById('exp-id').value;
  const body = {
    title: document.getElementById('exp-title').value.trim(),
    organization: document.getElementById('exp-org').value.trim(),
    tag: document.getElementById('exp-tag').value.trim() || 'INTERNSHIP',
    date_start: document.getElementById('exp-start').value.trim(),
    date_end: document.getElementById('exp-end').value.trim(),
    description: document.getElementById('exp-desc').value.trim(),
    order: 0,
    show: True
  };

  let res;
  if (expId) {
    res = await fetch(`/api/experience/${expId}`, { method: 'PUT', headers, body: JSON.stringify(body) });
  } else {
    res = await fetch('/api/experience', { method: 'POST', headers, body: JSON.stringify(body) });
  }

  if (res.ok) {
    document.getElementById('form-timeline').reset();
    document.getElementById('exp-id').value = '';
    await loadTimeline();
  } else {
    alert('Failed to save timeline entry');
  }
});

async function deleteTimeline(id) {
  if (!confirm(`Delete timeline entry #${id}?`)) return;
  const headers = await getAuthHeader();
  const res = await fetch(`/api/experience/${id}`, { method: 'DELETE', headers });
  if (res.ok) await loadTimeline();
  else alert('Failed to delete timeline entry');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initAdmin);
