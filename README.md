# My Place — Private Beachfront Villa (Diani Beach, Kenya)

A full-stack website for a private beachfront villa: a public marketing/booking site plus
a secure admin dashboard for managing bookings, inquiries, gallery photos, availability,
and villa content.

- **Frontend:** React 18 + Vite (JavaScript)
- **Backend:** Node.js + Express (REST API)
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt password hashing

---

## 1. Project overview

```
my-place/
├── frontend/          React + Vite public site and admin dashboard
├── backend/           Express REST API
├── database/
│   └── schema.sql     PostgreSQL schema
├── README.md
└── .gitignore
```

The public site covers: Home, About, The Villa, Amenities, Gallery, Experience Diani,
Location, Stays, Policies & House Rules, and a Contact/Booking form. The admin dashboard
(`/admin`) covers: overview stats, booking management, a calendar/availability tool,
inquiry management, gallery management, and editable villa settings — all without
touching source code.

## 2. Requirements

- Node.js 18 or later
- PostgreSQL 14 or later
- npm

## 3. Database setup

### Fast local setup with Docker Desktop

If Docker Desktop is installed, this project includes a ready-to-use local PostgreSQL
database. From the project root, run:

```powershell
docker compose up -d postgres
```

It creates `myplace_db` and loads `database/schema.sql` automatically. Set this exact
value in `backend/.env` for the included local database:

```env
DATABASE_URL=postgresql://myplace_user:myplace_pass@localhost:5432/myplace_db
```

Check the database is ready with `docker compose ps`. To start again later, use the
same `docker compose up -d postgres` command. Do not use `docker compose down -v`
unless you intentionally want to erase all local booking data.

### Manual PostgreSQL setup

1. Create a database and a dedicated user:

   ```sql
   CREATE DATABASE myplace_db;
   CREATE USER myplace_user WITH ENCRYPTED PASSWORD 'choose_a_strong_password';
   GRANT ALL PRIVILEGES ON DATABASE myplace_db TO myplace_user;
   ```

2. Load the schema:

   ```bash
   psql -U myplace_user -d myplace_db -f database/schema.sql
   ```

   (On Windows, run this from the PostgreSQL `bin` folder's `psql.exe`, or use pgAdmin's
   query tool with the contents of `database/schema.sql`.)

## 4. Backend setup

```powershell
cd backend
Copy-Item .env.example .env
```

Edit `.env`:

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `DATABASE_URL` | `postgresql://myplace_user:PASSWORD@localhost:5432/myplace_db` |
| `DATABASE_SSL` | `true` only if your Postgres host requires SSL |
| `JWT_SECRET` | A long random string — generate with `openssl rand -hex 32` |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `FRONTEND_URL` / `CORS_ORIGIN` | The frontend's URL |
| `WHATSAPP_NUMBER` | Default WhatsApp number (also editable later from the admin dashboard) |
| `CONTACT_EMAIL` | Default contact email |
| `INITIAL_ADMIN_*` | Used once by the `create-admin` script |

For deployments where secrets should not be stored as plaintext files, keep the source
values in `backend/.env`, set a deployment-only key, and generate the encrypted file:

```powershell
$env:MY_PLACE_ENCRYPTION_KEY="use-a-long-random-secret-stored-by-your-host"
npm run encrypt-env
```

The backend automatically reads `backend/.env.enc` when that key is present. In
production, it refuses to start if the encrypted file cannot be decrypted, if the key is
missing, or if `JWT_SECRET`/`DATABASE_URL` is not configured. Never commit `.env`, `.env.enc`,
or the encryption key.

Install dependencies and create the first admin account:

```bash
npm install
npm run create-admin
```

Run the API:

```bash
npm run dev      # development, auto-restarts on changes
npm start        # production
```

Confirm it's running: `GET http://localhost:5000/api/health`

For a complete local readiness check (including PostgreSQL), use
`GET http://localhost:5000/api/ready`. A `500` response means the API is running but
the database is unavailable or its connection details are incorrect.

## 5. Frontend setup

```powershell
cd frontend
Copy-Item .env.example .env
```

For local development, keep `VITE_API_URL=/api`; Vite proxies those requests to
`http://localhost:5000` so the browser stays on one localhost origin. Set it to your
public API base only when building for a separately hosted frontend.

```powershell
npm.cmd install
npm.cmd run dev
```

Visit `http://localhost:5173`. The admin dashboard is at `/admin/login`.

## 6. Building for production

```bash
cd frontend
npm run build
```

This outputs static files to `frontend/dist/`, which you serve via a static file host,
Nginx, IIS, or any static-capable web server.

```bash
cd backend
npm install --omit=dev
npm start
```

## 7. Admin account creation

The `create-admin` script only creates an account if one doesn't already exist for that
email — it's safe to re-run. To create additional admins later, run it again with flags:

```bash
npm run create-admin -- --name="Second Admin" --email=second@example.com --password=AnotherStrongPass1
```

## 8. Deploying to a Windows Server VPS (Truehost)

1. **Install Node.js** — download the Windows installer (LTS) from nodejs.org and run it.
   Confirm with `node -v` and `npm -v` in Command Prompt.

2. **Install PostgreSQL** — download the Windows installer from postgresql.org, run it,
   and note the password you set for the `postgres` superuser. Use pgAdmin (included) or
   `psql` to run the setup in section 3.

3. **Configure environment variables** — copy `backend/.env.example` to `backend/.env` on
   the server and fill in production values (a fresh `JWT_SECRET`, the server's own
   `DATABASE_URL`, and your real domain in `FRONTEND_URL`/`CORS_ORIGIN`).

4. **Install npm dependencies** — on the server, inside both `backend/` and `frontend/`,
   run `npm install` (use `npm install --omit=dev` for the backend in production).

5. **Build the React frontend** — `cd frontend && npm run build`. Serve the resulting
   `frontend/dist/` folder with IIS, Nginx for Windows, or `serve`/`http-server` via PM2.

6. **Run the Node.js backend** — `cd backend && npm start` to confirm it runs, then move
   to PM2 for a persistent process (next step).

7. **Keep the backend running with PM2**:

   ```bash
   npm install -g pm2
   npm install -g pm2-windows-startup
   pm2-startup install
   cd backend
   pm2 start src/server.js --name my-place-api
   pm2 save
   ```

   PM2 will restart the API automatically if it crashes or the server reboots.

8. **Configure the domain** — point your domain's DNS at the VPS's public IP address
   (an `A` record for `@` and `www`, or as your registrar/Cloudflare requires).

9. **Configure Cloudflare DNS** — add the same `A` records in Cloudflare, set the proxy
   status to "Proxied" once SSL is working end-to-end, and set SSL/TLS mode to **Full**
   (or **Full (strict)** once you have a valid certificate on the server).

10. **Set up HTTPS/SSL** — easiest path is Cloudflare's free SSL (Flexible or Full mode)
    in front of the server. For a certificate on the server itself, use IIS with a
    Let's Encrypt client (e.g. win-acme) or terminate SSL at a reverse proxy.

11. **Connect frontend to backend** — set `frontend/.env`'s `VITE_API_URL` to your public
    API URL (e.g. `https://api.yourdomain.com/api`) before running `npm run build`, and
    set the backend's `CORS_ORIGIN`/`FRONTEND_URL` to your public site URL.

12. **Updating after changes** — pull/copy the new code, run `npm install` if
    dependencies changed, rebuild the frontend (`npm run build`), and restart the backend:
    `pm2 restart my-place-api`.

## 9. Testing checklist

- [ ] Public pages load and are responsive at mobile, tablet, and desktop widths
- [ ] Booking form validates required fields and rejects overlapping dates (409 response)
- [ ] Booking submission appears in the admin Bookings list
- [ ] Contact/general inquiries appear in the admin Inquiries list
- [ ] Admin login rejects wrong credentials and rate-limits repeated attempts
- [ ] Admin routes are inaccessible without a valid token (`/admin` redirects to login)
- [ ] Gallery images added/edited/deleted in admin reflect on the public Gallery page
- [ ] Blocking dates in the admin Calendar prevents those dates being requested publicly
- [ ] Villa Settings changes (WhatsApp number, contact info, check-in/out times) reflect
      on the public site without a code change
- [ ] Deleting a booking/inquiry asks for confirmation first

## 10. Security checklist

- [ ] `.env` files are excluded from version control (see `.gitignore`)
- [ ] `JWT_SECRET` is a long, random, production-specific value — never the example value
- [ ] Database user has only the privileges it needs
- [ ] `DATABASE_SSL=true` when your Postgres provider requires it
- [ ] HTTPS is enforced in production (via Cloudflare and/or the server)
- [ ] Rate limiting is active on `/api/auth/login` and public form endpoints
- [ ] Admin passwords are strong (the create-admin script enforces a minimum length)
- [ ] Regularly rotate the admin password and `JWT_SECRET` if you suspect exposure

## 11. Troubleshooting

- **`npm` is blocked by PowerShell execution policy** — use `npm.cmd` in PowerShell,
  for example `npm.cmd run dev` or `npm.cmd run build`.
- **`/api/ready` returns 500 / connection refused on port 5432** — start PostgreSQL
  (`docker compose up -d postgres`) or start your local PostgreSQL service, then verify
  that `DATABASE_URL` in `backend/.env` points to that database.

- **API won't start / "DATABASE_URL is not set"** — confirm `backend/.env` exists and is
  loaded (it isn't committed to git on purpose).
- **CORS errors in the browser** — check that `CORS_ORIGIN` in `backend/.env` exactly
  matches the frontend's origin (including protocol and port).
- **Login always fails** — confirm you ran `npm run create-admin` and are using that
  exact email/password.
- **Booking dates always conflict** — check for stale manual blocks in the admin
  Calendar page that may overlap the range you're testing.
- **Images don't show on the public Gallery** — the URL you saved may be broken or the
  host may block hotlinking; use a direct, publicly reachable image URL.

## 12. Future improvement recommendations

- M-Pesa and/or Stripe payment integration for deposits and balances
- Automated email notifications (booking confirmations, admin alerts) and WhatsApp
  notifications via a provider API
- Guest accounts with booking history
- Guest reviews
- Seasonal/promotional pricing and a rate calendar
- Support for multiple villas/properties from one dashboard
- Cloudinary (or similar) integration for direct image uploads instead of pasting URLs
