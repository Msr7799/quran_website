# Next.js Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install the dependencies:

```bash copybtn prompt:"$"
npm install
```

Then, run the development server:

```bash copybtn prompt:"$"
npm run dev
```

Or using Yarn:

```bash copybtn prompt:"$"
yarn dev
```

Or using pnpm:

```bash copybtn prompt:"$"
pnpm dev
```

Or using Bun:

```bash copybtn prompt:"$"
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying:

```text copybtn
app/page.tsx
```

The page auto-updates as you edit the file.

## Project Structure

A typical Next.js project structure looks like this:

```text
project/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Development Commands

### Start Development Server

```bash copybtn prompt:"$"
npm run dev
```

### Build for Production

```bash copybtn prompt:"$"
npm run build
```

### Start Production Server

```bash copybtn prompt:"$"
npm run start
```

### Run Lint

```bash copybtn prompt:"$"
npm run lint
```

## Next.js Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a font family created for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) — learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) — an interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) — source code, issues, and contributions.

## Deploy on Vercel

The easiest way to deploy your Next.js app is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

First, build the project locally:

```bash copybtn prompt:"$"
npm run build
```

Then deploy using Vercel CLI:

```bash copybtn prompt:"$"
npx vercel
```

For production deployment:

```bash copybtn prompt:"$"
npx vercel --prod
```

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.