
let CFG = (typeof PORTFOLIO_CONFIG !== 'undefined') ? PORTFOLIO_CONFIG : {};
let STATS    = CFG.stats    || { ctfRank: '#3', machines: 22, certifications: 4, leetcodeSolved: 150 };
let LEETCODE = CFG.leetcode || { profileUrl: 'https://leetcode.com/u/msuryawanshi05/' };
let RESUME   = CFG.resume   || { file: 'assets/Mukul_Resume.pdf' };

const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

function applyConfigData() {
  setEl('stat-ctf',      STATS.ctfRank);
  setEl('stat-machines', STATS.machines);
  setEl('stat-leetcode', STATS.leetcodeSolved);
  setEl('stat-certs',    STATS.certifications + '+');

  const lcCard = document.getElementById('stat-lc-card');
  if (lcCard && LEETCODE.profileUrl) lcCard.href = LEETCODE.profileUrl;

  const resumeBtn = document.getElementById('btn-resume');
  if (resumeBtn && RESUME.file) resumeBtn.href = RESUME.file;

  (CFG.projects || []).forEach(p => {
    const liveEl = document.getElementById(`proj-${p.id}-live`);
    if (liveEl && p.live) {
      liveEl.href = p.live;
      liveEl.style.display = 'inline-flex';
    }
  });
}

applyConfigData();

function renderTimeline(items) {
  const container = document.querySelector('#experience .timeline');
  if (!container || !items || !items.length) return;

  container.innerHTML = '';
  items.forEach(exp => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    const dateStr = exp.date_end ? `${exp.date_start} / ${exp.date_end}` : `${exp.date_start} / Present`;
    const bulletList = exp.description
      .split('\n')
      .filter(b => b.trim())
      .map(b => `<li>${b.replace(/^[•\-*]\s*/, '')}</li>`)
      .join('');

    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card glass-card reveal">
        <div class="timeline-header">
          <div>
            <span class="soc-tag">[${exp.tag || 'INTERNSHIP'}]</span>
            <h3 class="timeline-role">${exp.title}</h3>
            <span class="timeline-company">${exp.organization}</span>
          </div>
          <span class="timeline-date">${dateStr}</span>
        </div>
        <ul class="timeline-points">
          ${bulletList}
        </ul>
      </div>
    `;
    container.appendChild(item);
  });
}

// --- FETCH LIVE BACKEND DATA WITH FALLBACK TO CONFIG.JS ---
(async function loadLiveBackendData() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) return; // Keep config.js fallback
    const liveData = await res.json();
    if (liveData && liveData.stats) {
      CFG = liveData;
      STATS = {
        ctfRank: liveData.stats.ctf_rank,
        machines: liveData.stats.machines,
        certifications: liveData.stats.certifications,
        leetcodeSolved: liveData.stats.leetcode_solved
      };
      LEETCODE = { profileUrl: liveData.leetcode.profileUrl };
      RESUME = { file: liveData.resume.file };
      applyConfigData();

      if (liveData.experience && liveData.experience.length) {
        renderTimeline(liveData.experience);
      }
    }
  } catch (err) {
    // API not reachable or static server mode — silent fallback to config.js / HTML
  }
})();




const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const highlightNav = () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--text)' : '';
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.glass-card, .timeline-card, .badge-card, .extra-card, .section-title'
).forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

document.querySelectorAll('.skill-tag').forEach((tag, i) => {
  tag.style.animationDelay = `${(i * 0.18) % 3}s`;
  tag.classList.add('float-tag');
  tag.addEventListener('mouseenter', () => {
    tag.style.boxShadow = tag.classList.contains('sec')
      ? '0 0 18px rgba(124,58,237,0.5)' : '0 0 18px rgba(6,182,212,0.5)';
  });
  tag.addEventListener('mouseleave', () => { tag.style.boxShadow = ''; });
});

document.querySelectorAll('.badge-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    card.style.transform = `translateY(-3px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 65, MAX_DIST = 130, SPEED = 0.35;

  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };

  const Particle = () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED,
  });

  const init = () => { resize(); particles = Array.from({ length: COUNT }, Particle); };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.strokeStyle = `rgba(6,182,212,${(1 - dist / MAX_DIST) * 0.15})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124,58,237,0.45)'; ctx.fill();
    });
    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize, { passive: true });
  init(); draw();
})();

const tagline = document.querySelector('.hero-tagline');
if (tagline) {
  const texts = [
    'I break things to build them better.',
    'Offensive mindset. Defensive build.',
    'CTF player. Security engineer. Builder.',
    'From exploits to infrastructure.',
    'Security-first. Always.',
  ];
  let tIdx = 0, cIdx = 0, deleting = false;
  tagline.textContent = '';
  const type = () => {
    const full = texts[tIdx];
    if (!deleting) {
      tagline.textContent = full.slice(0, ++cIdx);
      if (cIdx === full.length) { deleting = true; setTimeout(type, 2400); return; }
    } else {
      tagline.textContent = full.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % texts.length; }
    }
    setTimeout(type, deleting ? 38 : 68);
  };
  setTimeout(type, 900);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw    = el.getAttribute('data-target') || el.textContent.trim();
    const prefix = raw.match(/^[^0-9]*/)?.[0] || '';
    const suffix = raw.match(/[^0-9]+$/)?.[0] || '';
    const target = parseInt(raw.replace(/\D/g, ''), 10);
    if (!target || target <= 0) return;

    const dur = 1600, step = 16;
    let start = 0;
    const inc = target / (dur / step);
    const tick = () => {
      start = Math.min(start + inc, target);
      el.textContent = prefix + Math.floor(start) + suffix;
      if (start < target) setTimeout(tick, step);
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => {
  el.setAttribute('data-target', el.textContent.trim());
  counterObserver.observe(el);
});

(function initFeed() {
  const feed = document.getElementById('ctf-feed');
  if (!feed) return;
  const ENTRIES = [
    { type: 'success', time: '11:02:14', msg: 'VulnHub: Kioptrix L2 - root shell obtained' },
    { type: 'alert',   time: '11:08:47', msg: 'CVE-2021-4034 - reproduced in lab environment' },
    { type: 'info',    time: '11:15:03', msg: 'Nmap: 3 open ports discovered on 192.168.56.x' },
    { type: 'success', time: '11:22:31', msg: 'ICYS CTF - Forensics flag captured (3rd place)' },
    { type: 'scan',    time: '11:29:08', msg: 'Burp Suite: SQLi vector found in auth endpoint' },
    { type: 'success', time: '11:36:55', msg: 'Privilege escalation via SUID binary - /usr/bin/find' },
    { type: 'alert',   time: '11:43:20', msg: 'Log anomaly: 47 failed SSH attempts in 60s window' },
    { type: 'info',    time: '11:51:09', msg: 'Wazuh SIEM alert: unusual outbound traffic pattern' },
    { type: 'scan',    time: '11:58:44', msg: 'OWASP ZAP: XSS vector detected in search param' },
    { type: 'success', time: '12:04:17', msg: 'TryHackMe: Mr. Robot box - user.txt + root.txt' },
    { type: 'info',    time: '12:11:33', msg: 'Wireshark: ARP poisoning attempt captured on .pcap' },
    { type: 'alert',   time: '12:19:02', msg: 'EncipherX CTF: Android APK reverse engineered' },
  ];
  let idx = 0;
  const addLine = () => {
    const entry = ENTRIES[idx % ENTRIES.length]; idx++;
    const line = document.createElement('div');
    line.className = `feed-line feed-${entry.type}`;
    line.innerHTML = `<span class="feed-time">${entry.time}</span><span class="feed-type">${entry.type.toUpperCase()}</span><span class="feed-msg">${entry.msg}</span>`;
    feed.appendChild(line);
    while (feed.children.length > 7) feed.removeChild(feed.firstChild);
    feed.scrollTop = feed.scrollHeight;
    requestAnimationFrame(() => line.classList.add('visible'));
  };
  for (let i = 0; i < 4; i++) addLine();
  setInterval(addLine, 3200);
})();

const REPOS = [
  { repo: 'Portable-Log-Analysis-Tool',       badgeId: 'badge-log'  },
  { repo: 'IP-Leak-Defense-System-StoryShip', badgeId: 'badge-ship' },
  { repo: 'Project-f1',                       badgeId: 'badge-f1'   },
];
REPOS.forEach(({ repo, badgeId }) => {
  const badge = document.getElementById(badgeId);
  if (!badge) return;
  fetch(`https://api.github.com/repos/msuryawanshi05/${repo}`)
    .then(r => r.json())
    .then(data => {
      if (!data.pushed_at) { badge.style.display = 'none'; return; }
      const days = (Date.now() - new Date(data.pushed_at)) / 86400000;
      const [label, cls] = days < 30 ? ['[LIVE] Active', 'active']
                         : days < 90 ? ['Maintained', 'maintained']
                         : ['Archived', 'archived'];
      badge.textContent = label;
      badge.className = `gh-badge gh-${cls}`;
    })
    .catch(() => { badge.style.display = 'none'; });
});

document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) * 0.28;
    const dy = (e.clientY - rect.top  - rect.height / 2) * 0.28;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progressBar.style.height = Math.min(pct, 100) + '%';
  }, { passive: true });
}

const emailLink = document.getElementById('contact-email');
const toast     = document.getElementById('copy-toast');
if (emailLink && toast) {
  emailLink.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('msuryawanshi.1945@gmail.com').then(() => {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2200);
    });
  });
}

const orbs = document.querySelectorAll('.mesh-orb');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      orbs[0]?.style && (orbs[0].style.transform = `translate(${y * 0.03}px, ${y * 0.04}px)`);
      orbs[1]?.style && (orbs[1].style.transform = `translate(${-y * 0.02}px, ${-y * 0.03}px)`);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// -- XTERM.JS TERMINAL --------------------------------------------------------
// Uses xterm@5.3.0 + xterm-addon-fit from CDN. All command data from config.js.
function initXterm() {
  const container = document.getElementById('xterm-container');
  if (!container || typeof Terminal === 'undefined') return;

  const term = new Terminal({
    fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace",
    fontSize: 13.5,
    lineHeight: 1.5,
    cursorBlink: true,
    cursorStyle: 'block',
    scrollback: 800,
    convertEol: true,
    theme: {
      background:          '#0a0a0f',
      foreground:          '#e2e8f0',
      cursor:              '#06b6d4',
      cursorAccent:        '#0a0a0f',
      selectionBackground: 'rgba(124,58,237,0.3)',
      black:    '#0a0a0f', brightBlack:   '#475569',
      red:      '#ef4444', brightRed:     '#f87171',
      green:    '#22c55e', brightGreen:   '#4ade80',
      yellow:   '#f59e0b', brightYellow:  '#fbbf24',
      blue:     '#7c3aed', brightBlue:    '#a855f7',
      magenta:  '#ec4899', brightMagenta: '#f472b6',
      cyan:     '#06b6d4', brightCyan:    '#22d3ee',
      white:    '#e2e8f0', brightWhite:   '#f8fafc',
    },
  });

  const fitAddon = new FitAddon.FitAddon();
  term.loadAddon(fitAddon);
  term.open(container);
  fitAddon.fit();
  window.addEventListener('resize', () => fitAddon.fit(), { passive: true });

  // ANSI escape helpers
  const R  = '\x1b[0m';
  const B  = '\x1b[1m';
  const DM = '\x1b[2m';
  const PU = '\x1b[38;2;168;85;247m';    // purple-l
  const CY = '\x1b[38;2;34;211;238m';    // cyan-l
  const GR = '\x1b[38;2;74;222;128m';    // green
  const YL = '\x1b[38;2;251;191;36m';    // yellow/gold
  const RE = '\x1b[38;2;248;113;113m';   // red
  const MT = '\x1b[38;2;148;163;184m';   // muted

  const a = (t) => `${B}${PU}${t}${R}`;  // accent (purple bold)
  const g = (t) => `${B}${YL}${t}${R}`;  // gold bold
  const l = (t) => `${CY}${t}${R}`;      // link (cyan)
  const d = (t) => `${DM}${MT}${t}${R}`; // dim/muted
  const hdr = (t) => `\r\n${B}${CY} ${t} ${R}`;  // section header

  // Command definitions - all data sourced from PORTFOLIO_CONFIG (config.js)
  const CMDS = {
    help: () => [
      hdr('available commands'),
      `  ${a('whoami')}     identity & role`,
      `  ${a('about')}      background & story`,
      `  ${a('skills')}     full skills list`,
      `  ${a('projects')}   projects + GitHub links`,
      `  ${a('certs')}      certifications`,
      `  ${a('ctf')}        CTF wins & platforms`,
      `  ${a('leetcode')}   LeetCode stats`,
      `  ${a('experience')} internship history`,
      `  ${a('contact')}    links & email`,
      `  ${a('clear')}      clear screen`,
    ],
    whoami: () => [
      hdr('whoami'),
      `  ${a('Mukul Suryawanshi')}`,
      `  Role    : Cybersecurity Engineer & Developer`,
      `  College : St. Vincent Pallotti College, Nagpur MH`,
      `  Focus   : Offensive security  .  SOC tooling  .  CTFs`,
      `  Email   : ${l('msuryawanshi.1945@gmail.com')}`,
    ],
    about: () => [
      hdr('about'),
      `  B.Tech CSE (Cybersecurity) — deliberate practitioner.`,
      `  Builds real security tools through CTFs, internships`,
      `  and conferences rather than coursework alone.`,
      ``,
      `  ${g('[3rd]')} ICYS National CTF  ${g('[2nd]')} Engineers Day Showcase`,
      `  Exploiting controlled lab environments -> production security tooling.`,
      ``,
      `  ${d('-- "The best defenders think like attackers." --')}`,
    ],
    skills: () => {
      const sec = (CFG.skills?.security     || []).join(' . ');
      const dev = (CFG.skills?.development  || []).join(' . ');
      return [
        hdr('skills & toolkit'),
        `  ${a('[Security]')}`,
        `  ${sec}`,
        ``,
        `  ${a('[Development]')}`,
        `  ${dev}`,
      ];
    },
    projects: () => [
      hdr('projects'),
      `  ${a('[1]')} Portable Log Analysis Tool`,
      `      USB forensic tool for air-gapped networks`,
      `      ${l('github.com/msuryawanshi05/Portable-Log-Analysis-Tool')}`,
      ``,
      `  ${a('[2]')} StoryShip — IP Leak Defense`,
      `      IPFS + cryptographic hashing for asset integrity`,
      `      ${l('github.com/msuryawanshi05/IP-Leak-Defense-System-StoryShip')}`,
      ``,
      `  ${a('[3]')} Project F1 — Formula 1 Data Intelligence`,
      `      Race data analysis . Python . Pandas`,
      `      ${l('github.com/msuryawanshi05/Project-f1')}`,
    ],
    certs: () => {
      const shown = (CFG.certs || []).filter(c => c.show);
      const lines = [hdr('certifications')];
      shown.forEach(c => lines.push(`  ${g('[cert]')} ${c.label}`));
      return lines;
    },
    ctf: () => [
      hdr('ctf & competitions'),
      `  ${g('[3rd]')} ICYS CTF — International Cyber Youth Summit (Oct 2025)`,
      `  ${g('[2nd]')} Engineers Day Showcase (Oct 2025)`,
      `  ${a('Top 2')} Smart India Internal Hackathon 2025`,
      ``,
      `  ${d('Platforms:')} TryHackMe . HackTheBox . VulnHub`,
      `  ${a(STATS.machines + '+')} machines pwned`,
    ],
    leetcode: () => [
      hdr('leetcode'),
      `  Problems Solved : ${a(String(STATS.leetcodeSolved))}`,
      `  Profile         : ${l(LEETCODE.profileUrl)}`,
    ],
    experience: () => [
      hdr('incident timeline — experience'),
      `  ${a('ShadowFox')}   ${CY}[INTERNSHIP]${R}   2025-07 / 2025-08`,
      `  ${d('  Pen testing . Metasploitable . Wireshark . privesc')}`,
      ``,
      `  ${a('Redynox')}     ${CY}[INTERNSHIP]${R}   2025-06 / 2025-07`,
      `  ${d('  Web VAPT . Burp Suite . Nessus . OWASP ZAP')}`,
    ],
    contact: () => [
      hdr('contact'),
      `  Email    : ${l('msuryawanshi.1945@gmail.com')}`,
      `  GitHub   : ${l('github.com/msuryawanshi05')}`,
      `  LinkedIn : ${l('linkedin.com/in/msuryawanshi05')}`,
      `  X        : ${l('x.com/msuryawanshi_05')}`,
    ],
    clear: null,  // handled in runCmd
  };

  const CMD_NAMES = Object.keys(CMDS);
  let inputBuf = '', history = [], hIdx = -1;

  const PROMPT = `\r\n${B}${PU}mukul@portfolio${R}${MT}:~${R}${CY}$${R} `;

  const showPrompt = () => { term.write(PROMPT); inputBuf = ''; };

  const runCmd = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) { showPrompt(); return; }
    if (raw.trim()) { history.unshift(raw.trim()); hIdx = -1; }

    if (cmd === 'clear') { term.clear(); showPrompt(); return; }

    if (CMDS[cmd] && typeof CMDS[cmd] === 'function') {
      const lines = CMDS[cmd]();
      (lines || []).forEach(ln => term.writeln(ln ?? ''));
    } else {
      term.writeln(`\r\n  ${RE}command not found:${R} ${raw.trim()}`);
      term.writeln(`  ${MT}type ${R}${a('help')}${MT} for available commands${R}`);
    }
    showPrompt();
  };

  term.onData(data => {
    const code = data.charCodeAt(0);

    if (data === '\r') {                    // Enter
      term.write('\r\n');
      runCmd(inputBuf);
      inputBuf = '';
      return;
    }
    if (data === '\x7f' || code === 8) {   // Backspace
      if (inputBuf.length > 0) { inputBuf = inputBuf.slice(0, -1); term.write('\b \b'); }
      return;
    }
    if (data === '\x1b[A') {               // Arrow Up
      hIdx = Math.min(hIdx + 1, history.length - 1);
      const h = history[hIdx] || '';
      term.write('\r' + PROMPT.slice(2) + h + ' '.repeat(Math.max(0, inputBuf.length - h.length)));
      term.write('\r' + PROMPT.slice(2) + h);
      inputBuf = h;
      return;
    }
    if (data === '\x1b[B') {               // Arrow Down
      hIdx = Math.max(hIdx - 1, -1);
      const h = hIdx === -1 ? '' : (history[hIdx] || '');
      term.write('\r' + PROMPT.slice(2) + h + ' '.repeat(Math.max(0, inputBuf.length - h.length)));
      term.write('\r' + PROMPT.slice(2) + h);
      inputBuf = h;
      return;
    }
    if (data === '\t') {                   // Tab autocomplete
      const partial = inputBuf.toLowerCase();
      const match = CMD_NAMES.find(c => c.startsWith(partial) && c !== partial);
      if (match) { term.write(match.slice(partial.length)); inputBuf = match; }
      return;
    }
    if (data === '\x03') {                 // Ctrl+C
      term.write('^C'); showPrompt(); inputBuf = ''; return;
    }
    if (data === '\x0c') {                 // Ctrl+L
      term.clear(); showPrompt(); return;
    }
    if (code >= 32 && code !== 127) {
      inputBuf += data; term.write(data);
    }
  });

  // Boot message
  term.writeln(`${B}${CY}Portfolio Terminal v2.0${R}  ${DM}${MT}powered by xterm.js${R}`);
  term.writeln(`${MT}type ${R}${a('help')}${MT} to see all commands  |  Tab to autocomplete${R}`);
  showPrompt();

  // Nav "Terminal" link scrolls to section and focuses terminal
  document.getElementById('nav-terminal-btn')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('terminal-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => term.focus(), 600);
  });
}

initXterm();

// -- SKILLS RADAR CHART (Chart.js) -------------------------------------------
// Data from PORTFOLIO_CONFIG.skills.radar in config.js
function initSkillsRadar() {
  const canvas = document.getElementById('skills-radar');
  if (!canvas || typeof Chart === 'undefined') return;

  const radarData = CFG.skills?.radar || [];
  if (!radarData.length) { canvas.closest('.skills-radar-wrapper')?.remove(); return; }

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: radarData.map(d => d.label),
      datasets: [{
        label: 'Proficiency',
        data:   radarData.map(d => d.value),
        backgroundColor:     'rgba(124, 58, 237, 0.12)',
        borderColor:         'rgba(168, 85, 247, 0.85)',
        borderWidth:          2,
        pointBackgroundColor: '#22d3ee',
        pointBorderColor:     '#22d3ee',
        pointHoverBackgroundColor: '#a855f7',
        pointRadius:          4,
        pointHoverRadius:     6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.8,
      animation: { duration: 1200, easing: 'easeInOutQuart' },
      // Padding keeps side labels (Exploitation, SIEM) fully visible
      layout: { padding: { left: 65, right: 65, top: 10, bottom: 10 } },
      scales: {
        r: {
          min: 0, max: 100,
          beginAtZero: true,
          grid:       { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: {
            color: '#94a3b8',
            font:  { family: 'monospace', size: 10 },
          },
          ticks: {
            color:           'rgba(255,255,255,0.25)',
            backdropColor:   'transparent',
            stepSize:         25,
            font:            { size: 9 },
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.raw}% proficiency` },
          backgroundColor: 'rgba(10,10,15,0.95)',
          borderColor:     'rgba(124,58,237,0.4)',
          borderWidth:      1,
          titleColor:       '#22d3ee',
          bodyColor:        '#e2e8f0',
          padding:          10,
        },
      },
    },

  });
}

initSkillsRadar();

// -- ONE-TIME HERO GLITCH + SCANLINE ON PAGE LOAD ----------------------------
(function heroEntrance() {
  // Glitch: apply class to hero name, animation plays once via CSS
  const heroName = document.querySelector('.hero-name');
  if (heroName) heroName.classList.add('glitch-once');

  // Scanline: inject a div, CSS animates it sweeping down once, then remove it
  const scanline = document.createElement('div');
  scanline.className = 'scanline-sweep';
  document.body.appendChild(scanline);
  setTimeout(() => scanline.remove(), 2000);
})();

// -- CURSOR GLOW --------------------------------------------------------------
const glow = document.createElement('div');
glow.style.cssText = `position:fixed;width:260px;height:260px;border-radius:50%;
  background:radial-gradient(circle,rgba(124,58,237,0.05) 0%,transparent 70%);
  pointer-events:none;z-index:0;transform:translate(-50%,-50%);
  transition:left 0.1s ease,top 0.1s ease;`;
document.body.appendChild(glow);
document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

// -- EASTER EGG: DevTools console message ------------------------------------
// If you're reading this, you already passed the first test.
console.log(
  '%c  __ _  __ _\n' +
  ' /  ` |/  ` |\n' +
  ' \\__, |\\__, |\n',
  'color:#7c3aed; font-family: monospace; font-size: 12px;'
);
console.log(
  '%cMukul Suryawanshi%c  |  Security Engineer & CTF Player',
  'color:#22d3ee; font-size:14px; font-weight:bold;',
  'color:#94a3b8; font-size:12px;'
);
console.log(
  '%c  msuryawanshi.1945@gmail.com\n' +
  '  github.com/msuryawanshi05\n' +
  '  linkedin.com/in/msuryawanshi05\n\n' +
  '  Type help in the terminal above -- it actually works.',
  'color:#06b6d4; font-size:12px; line-height:1.8;'
);
console.log('%c[security.txt available at /security.txt per RFC 9116]', 'color:#475569; font-size:11px;');

const PROOF_DATA = {
  sih: {
    title: 'Smart India Internal Hackathon - Proof',
    images: [
      'assets/Proof_images/SIH/image1.jpeg',
      'assets/Proof_images/SIH/image2.jpeg',
      'assets/Proof_images/SIH/Team.jpeg',
    ],
  },
  icys: {
    title: 'ICYS CTF 2025 - Proof',
    images: [
      'assets/Proof_images/ICYS/image1.jpeg',
      'assets/Proof_images/ICYS/image2.jpeg',
      'assets/Proof_images/ICYS/image3.jpeg',
    ],
  },
  encipherx: {
    title: 'EncipherX 4.0 - Event Photos',
    images: [
      // Image1.jpeg removed - file is corrupt (not a valid JPEG). Replace the file to re-add.
      'assets/Proof_images/EncipherX 4.0 CTF/Inauguration.jpeg',
      'assets/Proof_images/EncipherX 4.0 CTF/Organising_Team.jpeg',
    ],
  },
  seasides: {
    title: 'Seasides InfoSec 2K26 - Conference',
    images: [
      'assets/Proof_images/Seasides/image1.png',
      'assets/Proof_images/Seasides/image2.jpeg',
      'assets/Proof_images/Seasides/image3.jpeg',
      'assets/Proof_images/Seasides/Hardware village.jpeg',
      'assets/Proof_images/Seasides/Red teaming.png',
      'assets/Proof_images/Seasides/Social_engg_village.png',
    ],
  },
  web3: {
    title: 'Web3 Hackathon 2025 - Event Photos',
    images: [
      'assets/Proof_images/Web3-hackathon/Ongoing_Event.jpeg',
      'assets/Proof_images/Web3-hackathon/image3.jpeg',
      'assets/Proof_images/Web3-hackathon/Organising Team.png',
    ],
  },
};

const proofOverlay = document.getElementById('proof-overlay');
const proofModal   = document.getElementById('proof-modal');
const proofGrid    = document.getElementById('proof-grid');
const proofTitle   = document.getElementById('proof-title');
const proofClose   = document.getElementById('proof-close');
const proofZoom    = document.getElementById('proof-zoom');
const zoomImg      = document.getElementById('zoom-img');
const zoomPrev     = document.getElementById('zoom-prev');
const zoomNext     = document.getElementById('zoom-next');

let currentImages = [], zoomIndex = 0;

const showZoom = (idx) => {
  if (!currentImages.length) return;
  zoomIndex = ((idx % currentImages.length) + currentImages.length) % currentImages.length;
  zoomImg.alt = `Photo ${zoomIndex + 1} of ${currentImages.length}`;
  zoomImg.src = currentImages[zoomIndex];
  zoomImg.onerror = () => {
    zoomImg.alt = 'Image unavailable - file may be missing or corrupt';
    zoomImg.style.opacity = '0.3';
  };
  zoomImg.onload = () => { zoomImg.style.opacity = '1'; };
  proofGrid.style.display = 'none';
  proofZoom.style.display = 'flex';
};

const backToGrid = () => {
  proofZoom.style.display = 'none';
  proofGrid.style.display = '';
  zoomImg.src = '';
};

zoomPrev?.addEventListener('click', (e) => { e.stopPropagation(); showZoom(zoomIndex - 1); });
zoomNext?.addEventListener('click', (e) => { e.stopPropagation(); showZoom(zoomIndex + 1); });

document.addEventListener('keydown', e => {
  if (proofZoom?.style.display === 'flex') {
    if (e.key === 'ArrowRight') showZoom(zoomIndex + 1);
    if (e.key === 'ArrowLeft')  showZoom(zoomIndex - 1);
  }
});

window.openProof = (key) => {
  const data = PROOF_DATA[key];
  if (!data || !proofOverlay) return;
  currentImages = data.images;
  zoomIndex = 0;
  proofTitle.textContent = data.title;
  proofGrid.innerHTML = '';
  proofZoom.style.display = 'none';
  proofGrid.style.display = '';
  zoomImg.src = '';

  data.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${data.title} - photo ${i + 1}`;
    img.loading = 'lazy';
    img.onerror = () => { img.style.display = 'none'; };
    img.addEventListener('click', () => showZoom(i));
    proofGrid.appendChild(img);
  });
  proofOverlay.classList.add('active');
  proofOverlay.setAttribute('aria-hidden', 'false');
};

const closeProof = () => {
  proofOverlay.classList.remove('active');
  proofOverlay.setAttribute('aria-hidden', 'true');
  proofZoom.style.display = 'none';
  proofGrid.style.display = '';
  zoomImg.src = '';
};

proofClose?.addEventListener('click', closeProof);
proofOverlay?.addEventListener('click', e => { if (e.target === proofOverlay) closeProof(); });


const certOverlay = document.getElementById('cert-overlay');
const certModal   = document.getElementById('cert-modal');
const certTitle   = document.getElementById('cert-title');
const certClose   = document.getElementById('cert-close');
const certFrame   = document.getElementById('cert-frame');

window.openCert = (file, label) => {
  if (!certOverlay) return;
  certTitle.textContent = label || 'Certificate';
  certFrame.src = file;
  certOverlay.classList.add('active');
  certOverlay.setAttribute('aria-hidden', 'false');
};

certClose?.addEventListener('click', () => {
  certOverlay.classList.remove('active');
  certFrame.src = '';
});
certOverlay?.addEventListener('click', e => {
  if (e.target === certOverlay) { certOverlay.classList.remove('active'); certFrame.src = ''; }
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (certOverlay?.classList.contains('active')) { certOverlay.classList.remove('active'); certFrame.src = ''; }
  else if (proofZoom?.style.display === 'flex') backToGrid();
  else if (proofOverlay?.classList.contains('active')) closeProof();
});
