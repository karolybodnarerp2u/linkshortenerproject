# Link Shortener Project - Technical Description

## Project Architecture Overview

Your **Link Shortener Project** uses a modern full-stack architecture combining four key tools:

### **1. Next.js (Framework)**

- Serves as the full-stack JavaScript framework
- Handles both frontend (React components) and backend (API routes)
- Provides server-side rendering, static generation, and API capabilities
- Used for: UI rendering, authentication middleware, database operations

### **2. Clerk (Authentication)**

- Manages user authentication and authorization
- Wraps your entire app in `ClerkProvider`
- Provides UI components: `SignInButton`, `SignUpButton`, `UserButton`
- Protects routes via middleware in `proxy.ts`
- Stores user identity securely (no password management needed)

### **3. Drizzle ORM (Database Layer)**

- Type-safe database query builder
- Converts JavaScript/TypeScript into SQL queries
- Uses PostgreSQL dialect (configured in `drizzle.config.ts`)
- Reads schema from `db/schema.ts`
- Provides connection via `db` instance in `db/index.ts`

### **4. Neon (PostgreSQL Database)**

- Serverless PostgreSQL database hosted in the cloud
- Connected via `DATABASE_URL` environment variable
- Stores all application data (users, links, etc.)
- Drizzle communicates with Neon via HTTP client (`drizzle-orm/neon-http`)

---

## Data Flow

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │ HTTP Request
       ▼
┌──────────────────┐
│   Next.js        │
│ ┌──────────────┐ │
│ │ API Routes   │ │
│ │ Pages (SSR)  │ │
│ │ Middleware   │ │
│ └──────────────┘ │
└──────┬───────────┘
       │
       ├──────────────────┬─────────────────┐
       ▼                  ▼                 ▼
   ┌────────────┐    ┌──────────────┐   ┌──────────┐
   │   Clerk    │    │  Drizzle ORM │   │ Env Vars │
   │   (Auth)   │    │  (Queries)   │   │ (.env)   │
   └────────────┘    └──────┬───────┘   └──────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Neon Database   │
                    │   PostgreSQL     │
                    │  (Data Storage)  │
                    └──────────────────┘
```

---

## User Journey & Typical Workflow

### 1. **User Authentication Flow**

- User visits the app
- Next.js middleware checks Clerk authentication status
- If not authenticated:
  - Clerk displays Sign In/Sign Up page
  - User enters credentials
  - Clerk verifies and creates session
  - Auth token stored in browser
- If authenticated: User sees protected content

### 2. **Create Short Link Flow**

1. **User submits form** → Browser sends POST request to `/api/shorten`
2. **Next.js receives request** → Validates input data
3. **Verify authentication** → Calls Clerk to confirm user identity
4. **Query database** → Drizzle ORM constructs SQL INSERT query
5. **Neon stores data** → PostgreSQL database persists the short link
6. **Return response** → API sends JSON response back to browser
7. **Display result** → React component renders the short link

### 3. **Retrieve Link Flow**

1. User clicks short link or visits app
2. Next.js API route receives request
3. Drizzle queries Neon for matching record
4. Database returns original URL
5. Next.js redirects user to original URL

---

## Tech Stack - Connections & Responsibilities

| Tool        | Purpose                         | Responsibility                                              |
| ----------- | ------------------------------- | ----------------------------------------------------------- |
| **Next.js** | Full-stack framework            | Server, routing, API endpoints, middleware                  |
| **React**   | UI library                      | Components, frontend rendering                              |
| **Clerk**   | Authentication service          | User sign-up, sign-in, session management, protected routes |
| **Drizzle** | ORM (Object-Relational Mapping) | Type-safe database queries, schema management               |
| **Neon**    | PostgreSQL Database             | Data persistence, storage                                   |

---

## How They Connect

### Connection Steps:

1. **User visits app** → Next.js serves the page
2. **Clerk checks** → Is the user logged in?
3. **User submits data** → Next.js API route receives it
4. **Drizzle executes** → Type-safe query to database
5. **Neon stores/retrieves** → Data persisted in cloud PostgreSQL
6. **Response sent back** → User sees results

### Security & Configuration

- All connections are secured via environment variables in `.env.local`
- **CLERK_SECRET_KEY** → Server-side authentication
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** → Client-side (public)
- **DATABASE_URL** → Neon connection string

---

## Project File Structure

```
├── app/
│   ├── layout.tsx          # Root layout with ClerkProvider
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── db/
│   ├── schema.ts           # Drizzle database schema (define tables)
│   └── index.ts            # Drizzle connection instance
├── components/
│   └── ui/                 # Shadcn UI components
├── drizzle.config.ts       # Drizzle configuration
├── proxy.ts                # Clerk middleware for protected routes
├── .env.local              # Environment variables (not committed)
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## Next Steps for Development

1. **Define database schema** in `db/schema.ts`:
   - Users table (from Clerk)
   - Links table (original URL, short code, created by)
   - Visits table (analytics)

2. **Create API routes** in `app/api/`:
   - `POST /api/shorten` → Create short link
   - `GET /api/links` → List user's links
   - `GET /api/[shortCode]` → Redirect to original URL

3. **Build UI components** in `app/` and `components/`:
   - Link creation form
   - Links list/dashboard
   - Stats/analytics display

4. **Deploy to Vercel**:
   - Next.js is optimized for Vercel
   - Environment variables configured in Vercel dashboard
   - Automatic deployments from GitHub
