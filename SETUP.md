# NGL Dashboard Setup Guide

## Quick Start (for team members)

The dashboard is live at: **nextgenerationlearners.com/dashboard**

Password: ask Brayan.

## Features

- **CRM** — Track contacts, send emails, log interactions
- **P&L** — Track revenue and expenses by person
- **Gmail Integration** — Send emails directly from the dashboard

## Running Locally

```bash
git clone https://github.com/ngl-team/next-gen-learners.git
cd next-gen-learners
npm install
```

Create a `.env.local` file:

```
TURSO_DATABASE_URL=your_turso_url
TURSO_AUTH_TOKEN=your_turso_token
NGL_AUTH_HASH=your_password_hash
SESSION_SECRET=any_random_string
```

To generate a password hash:
```bash
echo -n 'your_password' | shasum -a 256
```

To create your own Turso database:
```bash
npm install -g turso
turso auth login
turso db create my-ngl
turso db show my-ngl --url    # copy this as TURSO_DATABASE_URL
turso db tokens create my-ngl  # copy this as TURSO_AUTH_TOKEN
```

Then run:
```bash
npm run dev
```

Open http://localhost:3000/dashboard

## Gmail Setup (for sending emails)

1. Go to console.cloud.google.com
2. Create a project
3. Enable **Gmail API**
4. Go to Credentials → Create OAuth 2.0 Client ID (Web application)
5. Add redirect URI: `http://localhost:3000/api/auth/gmail/callback`
   (for production: `https://your-domain.com/api/auth/gmail/callback`)
6. Add to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   APP_URL=http://localhost:3000
   ```
7. Restart the dev server
8. Go to dashboard → CRM tab → click "Connect Gmail"

## Deploying Your Own Instance

1. Push to your own GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Add all env vars from `.env.local` to Vercel Environment Variables
4. Deploy

Your instance will have its own database, its own Gmail, its own data. Completely independent.
