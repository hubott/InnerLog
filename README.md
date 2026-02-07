# Inner Log
**Full-stack personal productivity and media tracking platform**
## Live Demo
[Visit the App →](https://inner-log-nine.vercel.app)

## Screenshots

**Home Page**
![Home Page](./Screenshots/Screenshot 2026-02-07 at 2.47.21 PM)

![Tasks Page](./Screenshots/Screenshot 2026-02-07 at 2.52.14 PM)

![Example Show Page](./Screenshots/Screenshot 2026-02-07 at 2.53.20 PM)

## Features

- User authentication (signup, login, secure sessions)
- Create, edit, delete daily notes
- Task management:
  - Set deadlines, priorities, and status (Not Started → In Progress → Completed)
  - Tab view: Overdue / Due Today / Upcoming
  - Edit priority and progression inline
- Shows/Seasons/Episodes tracking:
  - Add shows, seasons, episodes
  - Track thoughts and ratings
  - Cascading deletes handled via relational DB
- Responsive UI using Tailwind CSS
- Type-safe API layer with tRPC & Prisma ORM
- Deployed on Vercel with PostgreSQL on NeonDB

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS  
- **Backend:** tRPC, Prisma ORM  
- **Database:** PostgreSQL (NeonDB)  
- **Authentication:** NextAuth.js  
- **Deployment:** Vercel

## Getting Started

1. Clone the repo
```bash
git clone https://github.com/yourusername/innerlog.git
cd innerlog
```
2. Install dependencies
   npm install
3. Create a .env.local file (use .env.example as template)
4. Run the dev server
   npm run dev
   Open http://localhost:3000 to view the app

## What I Learned

- Designing relational schemas with cascading relationships
- Managing complex state in a full-stack React app
- Type-safe API design with tRPC
- Deploying a full-stack app with Next.js, Prisma, and PostgreSQL
- Implementing real-world features like inline editing, tab filters, and cascading deletes

## Future Improvements

- Search/filter functionality across notes, tasks, and shows
- Notifications / toast messages for actions
- Analytics dashboard (tasks completed, episodes watched)
- Dark mode toggle
- Mobile-first optimizations

