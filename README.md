# 3D Portfolio

Professional portfolio for Akash Kumar with Next.js, TypeScript, Tailwind CSS, tRPC, MongoDB, and a private admin dashboard.

## Run locally

```bash
docker start portfolio-mongo || docker run -d --name portfolio-mongo -p 27017:27017 mongo:7
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

- Email: `akash@gmail.com`
- Password: `Admin@123`

Change these in `.env.local` before deploying.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- tRPC v11
- MongoDB + Mongoose
- React Three Fiber

Projects are stored in MongoDB. Adding a project in the dashboard publishes it on the homepage.
