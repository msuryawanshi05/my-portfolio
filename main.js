
let CFG = (typeof PORTFOLIO_CONFIG !== 'undefined') ? PORTFOLIO_CONFIG : {};
let STATS    = CFG.stats    || { ctfRank: '#3', machines: '25+', certifications: '6', leetcodeSolved: 150, thmRank: 'Top 10%', htbStatus: 'Labs' };
let PROFILES = CFG.profiles || {
  leetcode: 'https://leetcode.com/u/msuryawanshi05/',
  tryhackme: 'https://tryhackme.com/p/msuryawanshi05',
  hackthebox: 'https://profile.hackthebox.com/profile/019fe6cd-1983-7008-9b4c-52c9297028e7?utm_medium=copy_url',
};
let LEETCODE = CFG.leetcode || { profileUrl: PROFILES.leetcode };
let RESUME   = CFG.resume   || { file: 'assets/Mukul_Resume.pdf' };

// Force scroll to top on every refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
});

const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

function applyConfigData() {
  setEl('stat-ctf',      STATS.ctfRank);
  setEl('stat-certs',    (STATS.certifications || '6') + '+');
  setEl('stat-thm',      STATS.thmRank || 'Top 10%');
  setEl('stat-machines', STATS.machines || '25+');
  setEl('stat-htb',      STATS.htbStatus || 'Active');
  setEl('stat-leetcode', STATS.leetcodeSolved || '150+');

  const thmCard = document.getElementById('stat-thm-card');
  if (thmCard && PROFILES.tryhackme) thmCard.href = PROFILES.tryhackme;

  const htbCard = document.getElementById('stat-htb-card');
  if (htbCard && PROFILES.hackthebox) htbCard.href = PROFILES.hackthebox;

  const lcCard = document.getElementById('stat-lc-card');
  if (lcCard && (PROFILES.leetcode || LEETCODE.profileUrl)) lcCard.href = PROFILES.leetcode || LEETCODE.profileUrl;

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

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile navigation drawer toggle
const navToggle = document.getElementById('nav-toggle');
const navLinksEl = document.getElementById('nav-links');
if (navToggle && navLinksEl) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinksEl.classList.toggle('mobile-open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  const closeMenu = () => {
    navLinksEl.classList.remove('mobile-open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  document.querySelectorAll('.nav-cta, .nav-brand').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#navbar')) {
      closeMenu();
    }
  });
}

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
      ? '0 0 18px rgba(239,68,68,0.5)'
      : tag.classList.contains('def')
      ? '0 0 18px rgba(6,182,212,0.5)'
      : '0 0 18px rgba(255,255,255,0.2)';
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

  const Particle = (x, y, vx, vy, isSpawned = false) => ({
    x: x !== undefined ? x : Math.random() * W,
    y: y !== undefined ? y : Math.random() * H,
    vx: vx !== undefined ? vx : (Math.random() - 0.5) * SPEED,
    vy: vy !== undefined ? vy : (Math.random() - 0.5) * SPEED,
    spawned: isSpawned,
    life: 1.0,
  });

  const init = () => { resize(); particles = Array.from({ length: COUNT }, () => Particle()); };

  // On background click, spawn 2-3 network nodes that connect with lines
  window.addEventListener('click', (e) => {
    if (e.target.closest('input, textarea, select, button, a')) return;
    const numToSpawn = 3;
    for (let k = 0; k < numToSpawn; k++) {
      const angle = (Math.PI * 2 * k) / numToSpawn + (Math.random() - 0.5) * 0.6;
      const speed = SPEED * (0.28 + Math.random() * 0.28);
      particles.push(Particle(
        e.clientX,
        e.clientY,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        true
      ));
    }
    if (particles.length > COUNT + 30) {
      particles.splice(COUNT, 3);
    }
  });

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      if (p.spawned) {
        p.life -= 0.002;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
      }
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const fade = (particles[i].life ?? 1) * (particles[j].life ?? 1);
          const isSpawnedLink = particles[i].spawned || particles[j].spawned;
          ctx.strokeStyle = isSpawnedLink
            ? `rgba(34,197,94,${(1 - dist / MAX_DIST) * 0.4 * fade})`
            : `rgba(148,163,184,${(1 - dist / MAX_DIST) * 0.1 * fade})`;
          ctx.lineWidth = isSpawnedLink ? 1.0 : 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.spawned ? 2.0 : 1.4, 0, Math.PI * 2);
      ctx.fillStyle = p.spawned
        ? `rgba(34,197,94,${0.85 * (p.life ?? 1)})`
        : 'rgba(148,163,184,0.3)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize, { passive: true });
  init(); draw();
})();

const tagline = document.querySelector('.hero-tagline');
if (tagline) {
  const texts = [
    'Offensive mindset. Defensive build.',
    'I break things to build them better.',
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
  const pushLine = (entry) => {
    const line = document.createElement('div');
    line.className = `feed-line feed-${entry.type}`;
    line.innerHTML = `<span class="feed-time">${entry.time}</span><span class="feed-type">${entry.type.toUpperCase()}</span><span class="feed-msg">${entry.msg}</span>`;
    feed.appendChild(line);
    while (feed.children.length > 7) feed.removeChild(feed.firstChild);
    feed.scrollTop = feed.scrollHeight;
    requestAnimationFrame(() => line.classList.add('visible'));
  };

  const addLine = () => {
    const entry = ENTRIES[idx % ENTRIES.length]; idx++;
    pushLine(entry);
  };

  window.pushFeedAlert = (msg, type = 'alert') => {
    const now = new Date();
    const time = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0'),
    ].join(':');
    pushLine({ type, time, msg });
  };

  for (let i = 0; i < 4; i++) addLine();
  setInterval(addLine, 3200);
})();

const REPOS = [
  { repo: 'SOC-for-Lab-',                     badgeId: 'badge-soc'  },
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
      let [label, cls] = days < 30 ? ['[LIVE] Active', 'active']
                         : days < 90 ? ['Maintained', 'maintained']
                         : ['Archived', 'archived'];
      if (repo === 'Project-f1' && label === '[LIVE] Active') {
        label = 'Active Dev';
      }
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
  emailLink.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('msuryawanshi.1945@gmail.com').then(() => {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2200);
      }).catch(() => {});
    }
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
      cursor:              '#22c55e',
      cursorAccent:        '#0a0a0f',
      selectionBackground: 'rgba(34, 197, 94, 0.25)',
      black:    '#0a0a0f', brightBlack:   '#475569',
      red:      '#ef4444', brightRed:     '#f87171',
      green:    '#22c55e', brightGreen:   '#4ade80',
      yellow:   '#f59e0b', brightYellow:  '#fbbf24',
      blue:     '#38bdf8', brightBlue:    '#7dd3fc',
      magenta:  '#f43f5e', brightMagenta: '#fb7185',
      cyan:     '#38bdf8', brightCyan:    '#7dd3fc',
      white:    '#e2e8f0', brightWhite:   '#f8fafc',
    },
  });

  const fitAddon = new FitAddon.FitAddon();
  term.loadAddon(fitAddon);
  term.open(container);
  
  const safeFit = () => {
    try {
      if (container && container.clientHeight > 0) {
        fitAddon.fit();
      }
    } catch (e) {}
  };
  safeFit();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(safeFit, 120);
  }, { passive: true });

  // ANSI escape helpers
  const R  = '\x1b[0m';
  const B  = '\x1b[1m';
  const DM = '\x1b[2m';
  const WH = '\x1b[38;2;248;250;252m';   // crisp white
  const GR = '\x1b[38;2;34;197;94m';     // terminal green
  const YL = '\x1b[38;2;251;191;36m';    // yellow/gold
  const RE = '\x1b[38;2;248;113;113m';   // red
  const MT = '\x1b[38;2;148;163;184m';   // muted slate
  const CY = GR;                          // green fallback
  const PU = WH;                          // white fallback

  const a = (t) => `${B}${WH}${t}${R}`;  // bold crisp white
  const g = (t) => `${B}${YL}${t}${R}`;  // gold bold
  const l = (t) => `${GR}${t}${R}`;      // link (terminal green)
  const d = (t) => `${DM}${MT}${t}${R}`; // dim/muted
  const hdr = (t) => `\r\n${B}${WH}--- ${t.toUpperCase()} ---${R}`;  // section header

  // Command definitions - all data sourced from PORTFOLIO_CONFIG (config.js)
  const CMDS = {
    help: () => [
      hdr('available commands'),
      `  ${a('whoami')}     identity & role`,
      `  ${a('about')}      background & story`,
      `  ${a('skills')}     full skills list (Wazuh, Splunk, RHEL, etc.)`,
      `  ${a('projects')}   projects + GitHub links`,
      `  ${a('certs')}      certifications`,
      `  ${a('ctf')}        CTF wins & platforms`,
      `  ${a('tryhackme')}  TryHackMe profile & rank`,
      `  ${a('hackthebox')} HackTheBox profile`,
      `  ${a('leetcode')}   LeetCode stats`,
      `  ${a('matrix')}     stream digital green rain`,
      `  ${a('flag')}       CTF flag challenge`,
      `  ${a('experience')} internship history`,
      `  ${a('contact')}    links & email`,
      `  ${a('clear')}      clear screen`,
    ],
    whoami: () => [
      hdr('whoami'),
      `  ${a('Mukul Suryawanshi')}`,
      `  Role    : Cybersecurity Engineer & Tool Builder`,
      `  College : St. Vincent Pallotti College of Engineering and Technology, Nagpur`,
      `  Focus   : Offensive security  .  SOC tooling  .  CTFs`,
      `  Email   : ${l('msuryawanshi.1945@gmail.com')}`,
    ],
    about: () => [
      hdr('about'),
      `  B.Tech Computer Science (Cybersecurity) undergraduate at St. Vincent Pallotti College of Engineering and Technology, Nagpur.`,
      `  Focused on systems internals, red teaming, and defensive tooling.`,
      ``,
      `  ${g('[2nd]')} Engineers Day Project Showcase (Air-gapped forensic log tool)`,
      `  ${g('[3rd]')} ICYS National CTF Podium Finisher`,
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
        `  ${a('[Development & Systems]')}`,
        `  ${dev}`,
      ];
    },
    projects: () => [
      hdr('projects'),
      `  ${a('[1]')} Distributed SOC for Lab ${g('[FEATURED]')}`,
      `      Multi-node lab SOC (Windows · Linux · macOS) . Wazuh SIEM telemetry`,
      `      ${l('github.com/msuryawanshi05/SOC-for-Lab-')}`,
      `      ${g('[Live Demo]')} ${l('https://soc-lab.antideploy.app')}`,
      ``,
      `  ${a('[2]')} Portable Log Analysis Tool`,
      `      USB forensic tool for air-gapped networks`,
      `      ${l('github.com/msuryawanshi05/Portable-Log-Analysis-Tool')}`,
      `      ${g('[Video Demo]')} ${l('youtube.com/watch?v=0CafFNWY91Q')}`,
      ``,
      `  ${a('[3]')} StoryShip - IP Leak Defense`,
      `      IPFS + cryptographic hashing for asset integrity`,
      `      ${l('github.com/msuryawanshi05/IP-Leak-Defense-System-StoryShip')}`,
      `      ${g('[Live Demo]')} ${l('https://storyship.antideploy.app')}`,
      ``,
      `  ${a('[4]')} Project F1 - Formula 1 Data Intelligence`,
      `      Real-time telemetry dashboard . FastAPI WebSockets . React`,
      `      ${l('github.com/msuryawanshi05/Project-f1')}`,
      `      ${g('[Live Demo]')} ${l('https://project-f1.antideploy.app')}`,
    ],
    certs: () => {
      const shown = (CFG.certs || []).filter(c => c.show);
      const lines = [hdr('certifications')];
      shown.forEach(c => lines.push(`  ${g('[cert]')} ${c.label}`));
      return lines;
    },
    ctf: () => [
      hdr('ctf & platforms'),
      `  ${g('[3rd]')} ICYS CTF - International Cyber Youth Summit (Oct 2025)`,
      `  ${g('[2nd]')} Engineers Day Showcase (Oct 2025)`,
      `  ${a('Top 2')} Smart India Internal Hackathon 2025`,
      ``,
      `  ${d('Platforms & Rankings:')}`,
      `  ${a('TryHackMe')} : ${l('tryhackme.com/p/msuryawanshi05')}  ${g('[Top 10%]')}`,
      `  ${a('HackTheBox')} : ${l('profile.hackthebox.com/profile/019fe6cd-1983-7008-9b4c-52c9297028e7')}`,
      `  ${a('Machines')}   : 25+ VulnHub / labs pwned`,
    ],
    tryhackme: () => [
      hdr('tryhackme'),
      `  Rank    : ${g('Top 10%')}`,
      `  Profile : ${l(PROFILES.tryhackme || 'https://tryhackme.com/p/msuryawanshi05')}`,
    ],
    hackthebox: () => [
      hdr('hackthebox'),
      `  Status  : ${a('Active Labs')}`,
      `  Profile : ${l(PROFILES.hackthebox || 'https://profile.hackthebox.com/profile/019fe6cd-1983-7008-9b4c-52c9297028e7?utm_medium=copy_url')}`,
    ],
    leetcode: () => [
      hdr('leetcode'),
      `  Problems Solved : ${a(String(STATS.leetcodeSolved))}`,
      `  Profile         : ${l(PROFILES.leetcode || LEETCODE.profileUrl)}`,
    ],
    sudo: () => {
      if (typeof window.pushFeedAlert === 'function') {
        window.pushFeedAlert('SECURITY ALERT: Unauthorized sudo attempt. This incident will be reported.', 'alert');
      }
      return [
        `\r\n  ${RE}Nice try! He is not in the sudoers file. This incident will be reported.${R}`,
      ];
    },
    flag: () => [
      hdr('flag.txt'),
      `  ${GR}Flag{s3cur1ty_thr0ugh_d3f3ns1v3_bu1ld_2k26}${R}`,
      `  ${d('[+] Location : /.hidden/flag.txt (chmod 0400)')}`,
      `  ${d('[+] SHA-256  : 4a9d70e4e20b0ec8ef25e0c6eb2d69f0237e1b72e90c64be7fe9d9e6e873b9e1')}`,
      `  ${d('[+] Status   : Solved & Authenticated')}`,
    ],
    experience: () => [
      hdr('incident timeline: experience'),
      `  ${a('ShadowFox')}   ${GR}[INTERNSHIP]${R}   2025-07 / 2025-08`,
      `  ${d('  Pen testing . Metasploitable . Wireshark . privesc')}`,
      ``,
      `  ${a('Redynox')}     ${GR}[INTERNSHIP]${R}   2025-06 / 2025-07`,
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

  const PROMPT = `\r\n${B}${GR}mukul@portfolio${R}${MT}:~${R}${GR}$${R} `;

  const showPrompt = () => { term.write(PROMPT); inputBuf = ''; };

  const runCmd = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) { showPrompt(); return; }
    if (raw.trim()) { history.unshift(raw.trim()); hIdx = -1; }

    if (cmd === 'clear') { term.clear(); showPrompt(); return; }

    if (cmd.startsWith('sudo')) {
      term.writeln(`\r\n  ${RE}Nice try! He is not in the sudoers file. This incident will be reported.${R}`);
      if (typeof window.pushFeedAlert === 'function') {
        window.pushFeedAlert('SECURITY ALERT: Unauthorized sudo attempt. This incident will be reported.', 'alert');
      }
      showPrompt();
      return;
    }

    if (cmd === 'flag' || cmd === 'cat flag.txt' || cmd === 'cat flag') {
      const lines = CMDS.flag();
      (lines || []).forEach(ln => term.writeln(ln ?? ''));
      showPrompt();
      return;
    }

    if (cmd === 'matrix') {
      term.writeln(`\r\n${GR}[*] Initializing digital rain stream... (Press any key to stop)${R}`);
      const matrixChars = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾙﾚﾛﾜ0123456789ABCDEF!@#$%^&*()_+-=~';
      let count = 0;
      let active = true;

      const timer = setInterval(() => {
        if (!active) return;
        let line = '';
        for (let col = 0; col < 62; col++) {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          const bright = Math.random() > 0.88;
          line += bright ? `\x1b[1;32m${char}\x1b[0m` : `\x1b[32m${char}\x1b[0m`;
        }
        term.writeln(line);
        count++;
        if (count >= 30) {
          clearInterval(timer);
          active = false;
          term.writeln(`\r\n${GR}[+] Digital rain sequence complete. Access maintained.${R}`);
          showPrompt();
        }
      }, 55);

      const cancelSub = term.onData(() => {
        if (active) {
          clearInterval(timer);
          active = false;
          term.writeln(`\r\n${YL}[!] Digital rain interrupted by operator.${R}`);
          showPrompt();
        }
        cancelSub.dispose();
      });
      return;
    }

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
  term.writeln(`${B}${WH}Portfolio Terminal v2.0${R}  ${DM}${MT}powered by xterm.js${R}`);
  term.writeln(`${MT}type ${R}${a('help')}${MT} to see all commands  |  Tab to autocomplete${R}`);
  showPrompt();

  // Nav "Terminal" link scrolls to section and focuses terminal
  document.getElementById('nav-terminal-btn')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('terminal-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => term.focus(), 600);
  });
}

try {
  initXterm();
} catch (err) {
  console.warn('initXterm error:', err);
}

// -- SKILLS RADAR CHART (Chart.js) -------------------------------------------
// Data from PORTFOLIO_CONFIG.skills.radar in config.js
function initSkillsRadar() {
  const canvas = document.getElementById('skills-radar');
  if (!canvas || typeof Chart === 'undefined') return;

  const radarData = CFG.skills?.radar || [];
  if (!radarData.length) { canvas.closest('.skills-radar-wrapper')?.remove(); return; }

  const isMobile = window.innerWidth < 640;

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: radarData.map(d => d.label),
      datasets: [{
        label: 'Proficiency',
        data:   radarData.map(d => d.value),
        backgroundColor:     'rgba(34, 197, 94, 0.1)',
        borderColor:         'rgba(34, 197, 94, 0.75)',
        borderWidth:          2,
        pointBackgroundColor: '#22c55e',
        pointBorderColor:     '#22c55e',
        pointHoverBackgroundColor: '#4ade80',
        pointRadius:          isMobile ? 3 : 4,
        pointHoverRadius:     isMobile ? 5 : 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: isMobile ? 1.25 : 1.8,
      animation: { duration: 1200, easing: 'easeInOutQuart' },
      layout: { padding: { left: isMobile ? 24 : 65, right: isMobile ? 24 : 65, top: 10, bottom: 10 } },
      scales: {
        r: {
          min: 0, max: 100,
          beginAtZero: true,
          grid:       { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: {
            color: '#94a3b8',
            font:  { family: 'monospace', size: isMobile ? 8.5 : 10 },
          },
          ticks: {
            color:           'rgba(255,255,255,0.25)',
            backdropColor:   'transparent',
            stepSize:         25,
            font:            { size: isMobile ? 8 : 9 },
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.raw}% proficiency` },
          backgroundColor: 'rgba(10,10,15,0.95)',
          borderColor:     'rgba(34,197,94,0.4)',
          borderWidth:      1,
          titleColor:       '#4ade80',
          bodyColor:        '#e2e8f0',
          padding:          10,
        },
      },
    },

  });
}

try {
  initSkillsRadar();
} catch (err) {
  console.warn('initSkillsRadar error:', err);
}

// -- TERMINAL BOOT ENTRANCE & PAGE DATA REVEAL ----------------------------
(function heroEntrance() {
  const bootScreen = document.getElementById('boot-screen');
  if (!bootScreen) return;
  const fillBar = document.querySelector('.boot-bar-fill');
  const statusText = document.getElementById('boot-status-text');

  let finished = false;
  const finishBoot = () => {
    if (finished) return;
    finished = true;
    bootScreen.classList.add('fade-out');

    const heroName = document.querySelector('.hero-name');
    if (heroName) heroName.classList.add('glitch-once');

    const scanline = document.createElement('div');
    scanline.className = 'scanline-sweep';
    document.body.appendChild(scanline);
    setTimeout(() => scanline.remove(), 2600);

    setTimeout(() => {
      if (bootScreen && bootScreen.parentNode) bootScreen.remove();
    }, 600);
  };

  const runBootSequence = () => {
    // Step 1: Start loading progress bar
    if (fillBar) fillBar.style.width = '35%';

    // Step 2: Initialize defensive modules
    setTimeout(() => {
      if (fillBar) fillBar.style.width = '68%';
      if (statusText) statusText.textContent = 'INITIALIZING SIEM & SOC TELEMETRY...';
    }, 500);

    // Step 3: Security integrity verification
    setTimeout(() => {
      if (fillBar) fillBar.style.width = '92%';
      if (statusText) statusText.textContent = 'VERIFYING SECURITY INTEGRITY...';
    }, 1050);

    // Step 4: Access granted
    setTimeout(() => {
      if (fillBar) fillBar.style.width = '100%';
      if (statusText) statusText.textContent = 'SYSTEM_READY · ACCESS GRANTED';
    }, 1500);

    // Step 5: Fade out boot screen
    setTimeout(finishBoot, 1850);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(runBootSequence, 50));
  } else {
    setTimeout(runBootSequence, 50);
  }

  // Safety fallback: dismiss boot screen after 3s maximum
  setTimeout(finishBoot, 3000);
})();

// -- CURSOR GLOW --------------------------------------------------------------
const glow = document.createElement('div');
glow.style.cssText = `position:fixed;width:260px;height:260px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,255,255,0.02) 0%,transparent 70%);
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
  'color:#22c55e; font-family: monospace; font-size: 12px;'
);
console.log(
  '%cMukul Suryawanshi%c  |  Security Engineer · Tool Builder · CTF Player',
  'color:#f8fafc; font-size:14px; font-weight:bold;',
  'color:#94a3b8; font-size:12px;'
);
console.log(
  '%c  msuryawanshi.1945@gmail.com\n' +
  '  github.com/msuryawanshi05\n' +
  '  linkedin.com/in/msuryawanshi05\n\n' +
  '  Type help in the terminal above -- it actually works.',
  'color:#38bdf8; font-size:12px; line-height:1.8;'
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

// -- TOGGLE MORE CERTS ------------------------------------------------------
const toggleCertsBtn = document.getElementById('btn-toggle-certs');
const moreCertsContainer = document.getElementById('more-certs');
const toggleCertsText = document.getElementById('toggle-certs-text');
const toggleCertsIcon = document.getElementById('toggle-certs-icon');

if (toggleCertsBtn && moreCertsContainer) {
  toggleCertsBtn.addEventListener('click', () => {
    const isExpanded = moreCertsContainer.classList.toggle('expanded');
    toggleCertsBtn.classList.toggle('expanded', isExpanded);
    toggleCertsBtn.setAttribute('aria-expanded', String(isExpanded));
    if (isExpanded) {
      if (toggleCertsText) toggleCertsText.textContent = 'Show Less';
      if (toggleCertsIcon) toggleCertsIcon.style.transform = 'rotate(180deg)';
    } else {
      if (toggleCertsText) toggleCertsText.textContent = 'View More';
      if (toggleCertsIcon) toggleCertsIcon.style.transform = 'rotate(0deg)';
      document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// -- DYNAMIC YEAR & BACK TO TOP ---------------------------------------------
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 450);
  }, { passive: true });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
