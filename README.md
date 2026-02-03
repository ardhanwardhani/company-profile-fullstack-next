# Company Profile CMS

A modern company profile website with blog and career CMS built with Next.js 14, PostgreSQL, and raw SQL queries.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **Database**: PostgreSQL with raw SQL queries
- **Authentication**: NextAuth.js
- **Language**: TypeScript

## Features

- **Public Website**: Home, About, Blog, Careers pages
- **Blog CMS**: Create, edit, publish blog posts with categories, tags, authors
- **Career CMS**: Manage job listings with departments, locations
- **User Management**: Role-based access control (Admin, Editor, HR, Content Manager)
- **SEO Optimization**: Meta tags, Open Graph, Schema markup

## Project Structure

```
company-profile-cms/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API Routes
│   │   │   ├── auth/         # NextAuth
│   │   │   ├── blog/         # Blog endpoints
│   │   │   └── careers/      # Career endpoints
│   │   ├── (public)/         # Public pages
│   │   └── (dashboard)/      # Admin dashboard
│   ├── lib/                   # Utility libraries
│   │   ├── db.ts             # Database connection
│   │   ├── auth.ts           # Auth utilities
│   │   ├── api.ts            # API helpers
│   │   ├── blog.ts           # Blog helpers
│   │   └── jobs.ts           # Jobs helpers
│   ├── types/                # TypeScript types
│   └── components/           # React components
├── scripts/                  # Database scripts
│   ├── migrate.ts           # Migration script
│   └── seed.ts              # Seed data
└── public/                   # Static files
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database URL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/company_profile"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up the database**
   ```bash
   # Create the database
   createdb company_profile

   # Run migrations
   npm run db:migrate

   # Seed initial data
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Public site: http://localhost:3000
   - Admin login: http://localhost:3000/login
   - Demo credentials:
     - Email: `admin@company.com`
     - Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/callback/credentials` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get session

### Blog
- `GET /api/blog/posts` - List posts (with filters)
- `GET /api/blog/posts/:id` - Get post by ID
- `GET /api/blog/posts?slug=xxx` - Get post by slug
- `POST /api/blog/posts` - Create post (auth required)
- `PUT /api/blog/posts?id=xxx` - Update post (auth required)
- `PATCH /api/blog/posts?id=xxx&status=published` - Update status (auth required)
- `DELETE /api/blog/posts?id=xxx` - Delete post (admin only)

- `GET /api/blog/categories` - List categories
- `GET /api/blog/tags` - List tags
- `GET /api/blog/authors` - List authors

### Careers
- `GET /api/careers/jobs` - List jobs (with filters)
- `POST /api/careers/jobs` - Create job (HR/Admin only)
- `GET /api/careers/lookup` - Get departments & locations
- `POST /api/careers/lookup` - Create department/location (HR/Admin only)

## Database Schema

### Main Tables
- `users` - CMS users with roles
- `blog_posts` - Blog content
- `blog_categories` - Blog categories
- `blog_tags` - Blog tags
- `blog_authors` - Blog authors
- `blog_post_tags` - Post-tag relationships
- `jobs` - Job listings
- `departments` - Departments
- `locations` - Locations

### User Roles
- `admin` - Full access to everything
- `editor` - Blog CRUD (draft/review only)
- `hr` - Job CRUD only
- `content_manager` - Blog publish, read-only jobs

## Development

### Adding New API Endpoint

1. Create route file: `src/app/api/[resource]/route.ts`
2. Export GET/POST/PUT/DELETE handlers
3. Use `withAuth()` for protected routes
4. Use `withMethods(['GET', 'POST'])` for allowed methods

### Adding New Table

1. Add migration in `scripts/migrate.ts`
2. Create TypeScript interface in `src/types/index.ts`
3. Add helper functions in `src/lib/`
4. Create API endpoints

### Database Queries

Always use parameterized queries to prevent SQL injection:

```typescript
// Good - parameterized
await pool.query('SELECT * FROM users WHERE email = $1', [email]);

// Bad - string concatenation
await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

```bash
npm run build
npm start
```

## License

MIT
