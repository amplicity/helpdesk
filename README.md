# Helpdesk

## Setup
1. Install dependencies
```
npm install
```
2. Create a `.env.local` file in the root directory of the project and add the following:
```
NEXT_PUBLIC_MAGIC_PUBLIC_KEY
MAGIC_SECRET_KEY
JWT_SECRET
SESSION_LENGTH_IN_DAYS
```

Note, due to prisma being unaware of `.env.local`, you must create a `.env` with `DATABASE_URL` and `NODE_ENV`, which can be set to `development` or `production`.

3. Run the development server
```
npm run dev
```
4. Navigate to localhost:3000!

## Stack
- Next.js
- Magic (Auth)
- Postgres / Prisma
- TailwindCSS