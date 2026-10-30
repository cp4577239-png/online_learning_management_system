# Learnova Learning Management System

Learnova is a learning management system with a React/Vite client and an Express/MongoDB API.

## Requirements

- Node.js 20 or newer
- npm
- MongoDB connection string

## Configure the API

In a terminal:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edit `server/.env` and set `MONGODB_URI` to your MongoDB connection string and `JWT_SECRET` to a private random secret of at least 32 characters. Keep `.env` files private; they are excluded from Git.

Start the API:

```powershell
npm run dev
```

The API listens on `http://localhost:4000` by default.

## Configure and run the client

In a second terminal:

```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

The client listens on `http://localhost:3000` by default. Set `VITE_API_BASE_URL` in `client/.env` if the API is hosted at a different URL.

## Checks and production builds

Run the client type check and production build from `client`:

```powershell
npm run lint
npm run build
```

Run the API type check and build from `server`:

```powershell
npm run typecheck
npm run build
```

Start a built API from `server` with `npm start`.

## GitHub

The repository root is this directory. Create a GitHub repository, add it as the `origin` remote, and push the `main` branch:

```powershell
git remote add origin https://github.com/<YOUR-USERNAME>/<REPOSITORY-NAME>.git
git push -u origin main
```
