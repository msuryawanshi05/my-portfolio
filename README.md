# Mukul Suryawanshi — Cybersecurity Portfolio & Full-Stack Backend

Modern, high-performance cybersecurity portfolio built with HTML5, CSS3, Vanilla JavaScript, xterm.js, and Chart.js, backed by a FastAPI REST backend with Clerk authentication, PostgreSQL database, and single-admin CRUD interface.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism, variables), Vanilla JS (`main.js`)
- **Interactive UI Components**: `xterm.js` (terminal emulator), `Chart.js` (skills radar)
- **Backend API**: FastAPI (Python 3.11), SQLAlchemy ORM, Pydantic v2
- **Database**: PostgreSQL (Azure Database for PostgreSQL Flexible Server / Local Postgres)
- **Database Migrations**: Alembic
- **Authentication**: Clerk JS SDK + JWKS RS256 JWT verification (`ADMIN_CLERK_USER_ID` enforcement)
- **Deployment Target**: Azure App Service (Python 3.11 runtime)

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Python 3.10+
- PostgreSQL database (or SQLite fallback)

### 2. Installation
```bash
# Clone repository
git clone https://github.com/msuryawanshi05/my-portfolio.git
cd my-portfolio

# Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your database URL and Clerk credentials:
```ini
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWKS_URL=https://api.clerk.com/v1/jwks
ADMIN_CLERK_USER_ID=user_...
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio
```

### 4. Database Initialization & Seeding
```bash
# Run database migrations
alembic upgrade head

# Seed initial portfolio data from config.js
python seed.py
```

### 5. Run Local Server
```bash
uvicorn app.main:app --reload --port 8000
```
- **Portfolio Website**: `http://localhost:8000/`
- **Admin Panel**: `http://localhost:8000/admin.html`
- **Interactive API Docs**: `http://localhost:8000/docs`

---

## 🔐 Clerk Authentication & Admin System Setup

1. **Create Clerk Application**:
   - Go to [dashboard.clerk.com](https://dashboard.clerk.com) and create a new application.
   - Copy your **Publishable Key** and **Secret Key**.
2. **Configure Admin Access**:
   - Set `CLERK_PUBLISHABLE_KEY` in `.env` and in `admin.js`.
   - Set `CLERK_SECRET_KEY` in `.env`.
   - Sign in to `http://localhost:8000/admin.html` with your Clerk account.
   - Go to Clerk Dashboard → **Users** → click your account → copy your **User ID** (`user_2...`).
   - Paste your User ID as `ADMIN_CLERK_USER_ID` in `.env`.
   - Now, only your specific user ID can execute write/update/delete operations on `/api/*`.

---

## ☁️ Deployment to Azure App Service

### 1. Provision Azure Database for PostgreSQL Flexible Server
1. In Azure Portal, create a **PostgreSQL Flexible Server**.
2. Set server name, admin username, and password.
3. Under Networking, allow Azure services to access the server and add your local IP to firewall rules.
4. Copy the connection string:
   `postgresql://<adminuser>:<password>@<server>.postgres.database.azure.com:5432/portfolio?sslmode=require`

### 2. Provision Azure App Service
1. Create an **App Service** (Linux, Python 3.11 runtime).
2. Under **Configuration** -> **Application settings**, add:
   - `DATABASE_URL`: `<your-azure-postgres-url>`
   - `CLERK_PUBLISHABLE_KEY`: `<your-clerk-pk>`
   - `CLERK_SECRET_KEY`: `<your-clerk-sk>`
   - `CLERK_JWKS_URL`: `<your-clerk-jwks-url>`
   - `ADMIN_CLERK_USER_ID`: `<your-clerk-user-id>`
   - `SCM_DO_BUILD_DURING_DEPLOYMENT`: `true`

### 3. Startup Command
Set the App Service Startup Command in General settings:
```bash
alembic upgrade head && python seed.py && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 4. Custom Domain & SSL
1. Go to **Custom domains** in Azure App Service.
2. Add your CNAME record pointing your domain to `<your-app-name>.azurewebsites.net`.
3. Add an Azure-managed SNI SSL certificate for free.

---

---

## 🔄 GitHub Sync & Customization Semantics

- **Endpoint**: `POST /api/projects/sync` (Admin-only).
- **Manual Trigger**: Click the **"Sync from GitHub"** button in the Admin Projects tab.
- **Unauthenticated Read Access**: Sync calls `GET /users/msuryawanshi05/repos` via public GitHub API (no PAT required). If rate limits (60 req/hr) occur, set `GITHUB_PAT=ghp_...` in `.env`.
- **Visibility (`show`)**: Newly discovered repositories start with `show=False` by default so unapproved repos never leak to the public site.
- **Customization Protection (`is_customized`)**:
  - When a repo is synced for the first time, `is_customized=False`.
  - When you manually edit a project's title, live link, or description in the Admin panel, `is_customized` is set to `True`.
  - Subsequent GitHub syncs will update `last_synced_at` and repo metadata **only for non-customized projects** (`is_customized=False`), preserving your custom edits and `show` toggle decisions indefinitely.

---

## 👁️ Universal Show/Hide Visibility Control

- All entity models (`Project`, `Cert`, `Skill`, `StatTile`, `Experience`) feature a `show: bool` column.
- **Public API (`GET /api/*`)**: Automatically filters `show == True`. Hidden items are strictly excluded from public consumption (including the `/api/config` aggregator).
- **Admin API (`GET /api/*?admin=true`)**: Returns all items regardless of `show` state.
- **Single-Action Toggle Endpoint**: `PATCH /api/{resource}/{id}/toggle-show` updates visibility instantaneously via inline toggle switches in `admin.html`.

---

## 📊 Dynamic Stat Tiles & Incident Timeline

1. **Stat Tiles (`/api/stats`)**: Replaces fixed stats with fully dynamic cards (label, value, symbol/icon, link URL, display order, show toggle).
2. **Incident Timeline (`/api/experience`)**: Powers the public timeline section with CRUD support for role titles, organization names, tags (e.g. `INTERNSHIP`, `PROJECT`, `ACHIEVEMENT`), start/end dates, order, and detailed descriptions.

---

## ⚡ Fallback Architecture
If the backend or database is offline, `main.js` automatically falls back to static rendering using `config.js`. The portfolio frontend will never break or display blank states even during backend maintenance.

