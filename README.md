<div align="center">

# 🛡️ Cybersecurity Portfolio & Terminal Experience
### Glassmorphic interactive portfolio with xterm.js terminal emulator and Chart.js proficiency radar

<!-- BADGE ROW 1: Context & Status -->
[![Domain](https://img.shields.io/badge/Domain-Cybersecurity%20%26%20Engineering-orange?style=for-the-badge)](#)
[![Built For](https://img.shields.io/badge/Built%20For-Personal%20Portfolio-blue?style=for-the-badge)](#)
[![Architecture](https://img.shields.io/badge/Architecture-Pure%20Static%20Jamstack-purple?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge)](#)

<!-- BADGE ROW 2: Tech Stack -->
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3_Glassmorphism-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![xterm.js](https://img.shields.io/badge/xterm.js-Terminal-000000?style=flat&logo=gnubash&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-Radar-FF6384?style=flat&logo=chartdotjs&logoColor=white)

> **Pure Static Architecture:** Zero backend dependencies, zero databases, zero authentication overhead. Deployable on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static host.

</div>

---

## 🧠 Overview

A high-performance cybersecurity portfolio and interactive experience built with vanilla web technologies. It features an authentic `xterm.js` CLI shell, dynamic skills radar visualization via Chart.js, glassmorphic styling, and instant customization via a centralized `config.js` configuration file.

## ✨ Key Features

- **Interactive Terminal Shell**: Embedded `xterm.js` terminal emulator allowing visitors to run commands (`help`, `whoami`, `skills`, `projects`, `certs`, `ctf`, `leetcode`, `experience`, `contact`) with keyboard navigation and autocomplete.
- **Skills Radar Chart**: Interactive Chart.js radar graph visualizing core competencies across Web Security, Scripting, Exploitation, SIEM / Monitoring, and Recon.
- **Pure Static Architecture**: Zero-backend, zero-database setup with near-instant load times and zero attack surface.
- **Centralized Configuration**: Edit `config.js` to modify statistics, project listings, skills, certificates, and radar charts instantly without touching the HTML markup.
- **Photo & Certificate Modals**: Lightweight client-side lightbox and PDF preview modal for hackathon proof photos and certifications.
- **Interactive Background**: Custom HTML5 canvas particle network and cursor-tracking lighting effects.

## 📁 Project Structure

```
portmy/
├── assets/              # Static media, logos, photos, & certificates
├── .well-known/         # Security RFC 9116 security.txt
├── config.js            # Central configuration file for content & stats
├── index.html           # Main portfolio landing page
├── main.js              # Client UI logic, xterm.js shell, & canvas effects
├── style.css            # Custom CSS3 glassmorphism styling
├── robots.txt           # Crawler instructions
├── humans.txt           # Credits and technology declaration
├── security.txt         # RFC 9116 security disclosure policy
└── README.md
```

## 🚀 Running Locally

Because this is a pure static website, you do not need any compilers, Python, or node packages. You can preview it with any static server:

```bash
# Using Python's built-in HTTP server:
python -m http.server 8000

# Or using npx serve:
npx serve .

# Or using VS Code Live Server extension:
# Right-click index.html -> "Open with Live Server"
```

Open `http://localhost:8000` in your web browser.

## ⚙️ Customization

Edit `config.js` to update dynamic values:

```javascript
const PORTFOLIO_CONFIG = {
  stats: {
    ctfRank: '#3',
    machines: 22,
    certifications: 4,
    leetcodeSolved: 150,
  },
  projects: [ ... ],
  certs: [ ... ],
  skills: { ... }
};
```

## 📎 Docs & Resources

- 🔑 [Public PGP Key](./pgp-key.txt) - Security contact verification key
- 📜 [Security Policy](./security.txt) - RFC 9116 security disclosure policy

---

<div align="center">

Built by **msuryawanshi.05**

</div>
