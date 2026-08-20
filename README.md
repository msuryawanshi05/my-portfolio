<div align="center">

# 🛡️ Full-Stack Cybersecurity Portfolio & Admin Engine
### Glassmorphic interactive portfolio, xterm.js terminal emulator, and single-admin REST API

<!-- BADGE ROW 1 — Context & Status -->
[![Domain](https://img.shields.io/badge/Domain-Cybersecurity%20%26%20Full--Stack-orange?style=for-the-badge)](#)
[![Built For](https://img.shields.io/badge/Built%20For-Personal%20Portfolio-blue?style=for-the-badge)](#)
[![Result](https://img.shields.io/badge/🏆%20Result-Azure%20Production%20Ready-silver?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Production-green?style=for-the-badge)](#)

<!-- BADGE ROW 2 — Actual Tech Stack -->
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3_Glassmorphism-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk_Auth-6C47FF?style=flat&logo=clerk&logoColor=white)

> **Context line:** Personal Engineering Project &nbsp;|&nbsp; **Category:** Cybersecurity & Full-Stack Web Development &nbsp;|&nbsp; **Deployment Target:** Azure App Service

🔴 **Demo:** Coming soon — will be replaced with 🔗 **[Live Demo](https://my-portfolio.azurewebsites.net)** once hosted

</div>

---

## 🧠 Overview

A high-performance cybersecurity portfolio and content management system built with vanilla web technologies, an interactive `xterm.js` CLI shell, and an async Python FastAPI REST backend. It features single-admin authenticated CRUD management via Clerk JWT validation, an automated GitHub repository sync engine, and automatic offline rendering resilience.

## ✨ Key Features

- **Interactive Terminal & Skills Radar** — Embedded `xterm.js` shell allowing visitors to run commands (`help`, `projects`, `contact`) paired with a Chart.js radar chart.
- **Single-Admin Clerk Authentication** — JWKS RS256 token verification enforcing strict `ADMIN_CLERK_USER_ID` checks on write/update/delete API endpoints.
- **GitHub Sync with Customization Lock** — Ingests public repositories (`GET /users/msuryawanshi05/repos`) while safeguarding manual title/description overrides via `is_customized` flag protection.
- **Zero-Downtime Fallback Architecture** — Client-side fallback to local `config.js` data ensures the portfolio never displays blank states even if the REST API or database is offline.

## 🏗️ Architecture

```
[ Visitor Browser ] ──▶ [ Vanilla JS + xterm.js / Chart.js ]
                                   │
              (HTTP REST API / Fallback to config.js)
                                   ▼
[ FastAPI Backend ] ◀── [ Clerk JWKS RS256 Token Guard ] ──▶ [ Admin Panel (admin.html) ]
        │
        ├──▶ [ PostgreSQL / SQLite (Alembic Migrations) ]
        └──▶ [ Public GitHub REST API Sync Engine ]
```

The system separates public read queries from privileged admin state updates. Public endpoints consume static data or unauthenticated API endpoints, while admin operations route through Clerk JWT validation and SQLAlchemy ORM.

## 🔥 The Hard Part

**Problem:** Automated GitHub sync runs risked overwriting curated project descriptions, custom live URLs, and manual visibility toggles set in the admin dashboard.  
**Approach:** Initial implementation re-fetched and overwritten all DB records from GitHub, which erased custom portfolio copy.  
**Solution:** Introduced an explicit `is_customized` boolean flag. When an admin modifies a project's metadata, `is_customized` flips to `True`, locking manual edits while still allowing GitHub syncs to refresh `last_synced_at` and repo star counts exclusively for unedited repositories.

## 📁 Project Structure

```
portmy/
├── app/
│   ├── main.py          # FastAPI application & API endpoints
│   ├── models.py        # SQLAlchemy ORM models (Project, Cert, Skill, Experience)
│   ├── schemas.py       # Pydantic v2 data validation schemas
│   └── database.py      # Database session setup
├── alembic/             # Alembic database migration scripts
├── assets/              # Static media, logos, & certificates
├── admin.html           # Single-admin CRUD management interface
├── admin.js             # Admin UI logic & Clerk JS integration
├── index.html           # Main portfolio landing page
├── main.js              # Client UI logic, xterm.js shell, & fallback engine
├── seed.py              # Initial portfolio database seed script
├── requirements.txt     # Python backend dependencies
└── README.md
```

## 🚀 Run It Locally

```bash
# 1. Clone repository
git clone https://github.com/msuryawanshi05/my-portfolio.git
cd my-portfolio

# 2. Create virtual environment & install dependencies
python -m venv venv
# Windows: venv\Scripts\activate | Unix: source venv/bin/activate
pip install -r requirements.txt

# 3. Initialize database & seed initial data
python seed.py

# 4. Start local development server
uvicorn app.main:app --reload --port 8000
```

### Config / Environment Variables

Copy `.env.example` to `.env` to configure database and Clerk authentication:

```env
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWKS_URL=https://api.clerk.com/v1/jwks
ADMIN_CLERK_USER_ID=user_...
DATABASE_URL=sqlite:///./portfolio.db
```

## 📎 Docs & Resources

- 🔑 [Public PGP Key](./pgp-key.txt) — Security contact verification key
- 📜 [Security Policy](./security.txt) — RFC 9116 security disclosure policy

## 📈 What's Next

- [ ] Automated CTF challenge writeup markdown parser
- [ ] Redis caching for GitHub API sync rate limits
- [ ] Dark/Light theme toggle persistence

---

<div align="center">

Built by **msuryawanshi.05**

</div>
