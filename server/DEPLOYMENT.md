# Vercel and MongoDB deployment

Deploy the client and API as separate Vercel projects:

1. Create a Vercel project with the repository's `server` directory as its Root Directory. The `api/[...path].ts` function serves the existing Express API and reuses a MongoDB connection while a function instance stays warm.
2. Add these server project environment variables in Vercel:
   - `MONGODB_URI`: your MongoDB Atlas connection string. Keep it private and only configure it on the server project.
   - `JWT_SECRET`: a unique random value with at least 32 characters.
   - `FRONTEND_ORIGIN`: the deployed client origin, without a trailing slash.
   - `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true` for a client and API hosted on separate Vercel domains.
   - `NODE_ENV=production`
3. In MongoDB Atlas, allow network access from the API deployment using the egress IP restrictions appropriate to your Vercel plan. Do not expose the database to the public internet.
4. Create a second Vercel project with `client` as its Root Directory. Set `VITE_API_BASE_URL` to the server deployment origin followed by `/api`, for example `https://your-api.vercel.app/api`, then redeploy the client.
5. Confirm the API responds at `https://your-api.vercel.app/api/health` with a successful database status.

To load the six starter catalog courses, register an instructor account, then run `npm run seed:courses -- instructor@example.com` from the `server` directory with `MONGODB_URI` set to the target database. The script skips existing course slugs and uses the registered account as the instructor; do not put production credentials in source control.

Accounts, courses, enrollments, learning progress, notes, certificates, orders, discussions, and admin user status are stored through the MongoDB API. Existing Firebase data is not automatically copied; export and import it separately before removing any Firebase project data. Checkout is still simulated by the app and is not a real payment-gateway integration.

For local development, set `MONGODB_URI` and `JWT_SECRET` in `server/.env` and `FRONTEND_ORIGIN=http://localhost:3000`. Set `VITE_API_BASE_URL=http://localhost:4000/api` in `client/.env`.

The function uses a zero-minimum, five-connection pool because serverless instances can scale independently and this application currently expects fewer than five concurrent database operations per instance. The 30-second idle timeout releases unused connections between bursts; the 10-second server-selection timeout preserves the existing fail-fast behavior.
