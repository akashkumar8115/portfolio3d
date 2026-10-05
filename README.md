# 3D Portfolio

Professional portfolio for Akash Kumar with Next.js, TypeScript, Tailwind CSS, tRPC, MongoDB, and a private admin dashboard.

## Run locally

Create `.env.local` from `.env.example`, then set a private admin email and password and a random `AUTH_SECRET` of at least 32 characters before starting the app. Never commit `.env.local`.

```bash
cp .env.example .env.local
docker start portfolio-mongo || docker run -d --name portfolio-mongo -p 27017:27017 mongo:7
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- tRPC v11
- MongoDB + Mongoose
- React Three Fiber

Projects are stored in MongoDB. Adding a project in the dashboard publishes it on the homepage.
