# Germplasm Request Portal

Full-stack germplasm request application built with Next.js App Router, Prisma ORM, Neon Postgres, Tailwind CSS, SheetJS, and Nodemailer.

## Features

- Excel ingestion from `.xlsx` and `.xls` files with dynamic header detection
- Public search across germplasm `name`, `description`, and `species`
- Live filtering with 300ms debounce and pagination
- Request modal with inline validation and email notification
- Admin-protected upload page and request log viewer
- CSV export for submitted requests

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

3. Generate the Prisma client:

```bash
npm run prisma:generate
```

4. Push the Prisma schema to Neon:

```bash
npx prisma db push
```

5. Seed sample data:

```bash
npm run prisma:seed
```

6. Start the development server:

```bash
npm run dev
```

7. Open the app:

- Public portal: `http://localhost:3000`
- Admin upload: `http://localhost:3000/admin/upload`
- Admin requests: `http://localhost:3000/admin/requests`

## Neon Setup

- Create a Neon database and copy its connection string.
- Paste that value into `DATABASE_URL` in `.env`.
- Keep `sslmode=require` in the URL.
- Run `npm run prisma:generate`
- Run `npx prisma db push`
- Run `npm run prisma:seed`

## Excel Headers

The upload parser detects these headers dynamically from row 1:

- `S.No`
- `Name`
- `Genome`
- `Grin ID`
- `Species`
- `Type`
- `Collection`
- `Accession`
- `Description`

## Notes

- Request logs are saved even if SMTP delivery fails.
- Duplicate `name` values are skipped during import and reported back to the admin UI.
- Route handlers live in `app/api/*` because this project uses the Next.js App Router.
- This project uses a single `.env` file. `.env.local` is not required.
