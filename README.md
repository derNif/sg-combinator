# SG Combinator

A platform to accelerate innovation in St. Gallen by providing co-founder matching, startup school, job listings, and an AI consultant.

## Features

- **Co-founder Matching**: Find the perfect co-founder for your startup based on skills, experience, and vision alignment.
- **Startup School**: Access curated resources, workshops, and mentorship to develop essential startup skills.
- **Job Listings**: Find talent or opportunities at startups in St. Gallen.
- **AI Consultant**: Get AI-powered advice for your startup challenges.

## Tech Stack

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.io/) (Authentication & Database)
- [shadcn/ui](https://ui.shadcn.com/) (UI Components)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Supabase:
   - Create a new project on [Supabase](https://supabase.io/)
   - Go to Project Settings > API to get your API keys
   - Update the `.env.local` file with your Supabase URL and keys
   - Go to Authentication > Settings and disable "Confirm email" requirement

4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/
├── app/                   # Next.js app directory (pages & layouts)
│   ├── auth/              # Authentication routes
│   ├── cofounder-matching/# Co-founder matching feature
│   ├── startup-school/    # Startup school feature
│   ├── jobs/              # Job listings feature
│   ├── ai-consultant/     # AI consultant feature
│   ├── layout.tsx         # Root layout with sidebar
│   └── page.tsx           # Home page
├── components/            # UI components
│   ├── auth/              # Authentication components
│   └── ui/                # UI components and sidebar
├── lib/                   # Utility functions
│   ├── supabase.ts        # Supabase client
│   └── supabase-server.ts # Supabase server client
└── public/                # Static assets
```

## Authentication

The application uses Supabase for authentication:
- Email/password login
- Protected routes that require authentication
- Redirect to login when accessing protected features

## Deployment

This project can be deployed on [Vercel](https://vercel.com/) or any other hosting platform that supports Next.js.
