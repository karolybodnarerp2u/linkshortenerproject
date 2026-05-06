# Agent Instructions - Link Shortener Project

## ⚠️🚨 CRITICAL REQUIREMENT - READ THIS FIRST 🚨⚠️

**BEFORE GENERATING ANY CODE, YOU MUST:**

1. **IDENTIFY** which domain(s) your task involves (UI, database, authentication, Next.js features, etc.)
2. **READ** the corresponding documentation file(s) in `/docs/` directory
3. **UNDERSTAND** the patterns, conventions, and requirements specific to that domain
4. **ONLY THEN** proceed to write code following those documented standards

### Why This Is Non-Negotiable:

- This project uses **Next.js 16.2.4** with breaking changes from earlier versions
- Your training data may contain **outdated patterns** that will cause errors
- The `/docs/` files contain **project-specific conventions** not found elsewhere
- **Failing to read documentation WILL result in code that doesn't work**

### Documentation Files You MUST Consult:

- **UI/Components?** → Read [docs/shadcn-ui-standards.md](docs/shadcn-ui-standards.md) FIRST
- **Database?** → Read [docs/database-patterns.md](docs/database-patterns.md) FIRST  
- **Authentication?** → Read [docs/authentication-clerk.md](docs/authentication-clerk.md) FIRST
- **Next.js features?** → Read [docs/nextjs-standards.md](docs/nextjs-standards.md) FIRST
- **TypeScript?** → Read [docs/typescript-conventions.md](docs/typescript-conventions.md) FIRST
- **General patterns?** → Read [docs/general-coding-standards.md](docs/general-coding-standards.md) FIRST

**NO EXCEPTIONS. READ THE DOCS FIRST. EVERY TIME.**

---

## Overview

This directory contains comprehensive coding standards and patterns for AI agents and developers working on the Link Shortener project. Each document focuses on a specific aspect of the codebase.

## Technology Stack

- **Framework:** Next.js 16.2.4 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** Neon PostgreSQL with Drizzle ORM
- **Authentication:** Clerk v7.3.0
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui with @base-ui/react
- **Icons:** lucide-react

## Documentation Structure

### 🔴 MANDATORY WORKFLOW 🔴

**STEP 1:** Identify what you're working on (UI? Database? Auth? API routes?)
**STEP 2:** Use the `read_file` tool to read the relevant `/docs/*.md` file(s)
**STEP 3:** Review the patterns, requirements, and examples in that documentation
**STEP 4:** Write code that follows those exact patterns

**DO NOT SKIP STEP 2. DO NOT WRITE CODE FROM MEMORY OR ASSUMPTIONS.**

All detailed agent instructions are located in the `/docs` directory. **You MUST read and follow the relevant documentation before writing ANY code.**

### Core Documentation Files

1. **[General Coding Standards](docs/general-coding-standards.md)**
   - Project overview and principles
   - Code organization and file naming
   - Error handling patterns
   - Performance optimization
   - Security best practices
   - Git commit conventions

2. **[Next.js Coding Standards](docs/nextjs-standards.md)**
   - App Router architecture
   - Server vs Client Components
   - Routing and API routes
   - Data fetching patterns
   - Metadata and SEO
   - Navigation and redirects

3. **[TypeScript Conventions](docs/typescript-conventions.md)**
   - Type definitions and annotations
   - Import aliases (`@/` path)
   - React component typing
   - Async/await patterns
   - Type guards and null handling
   - Generic types

4. **[Database & Drizzle ORM Patterns](docs/database-patterns.md)**
   - Schema definition
   - CRUD operations
   - Relationships and joins
   - Transactions
   - Migrations
   - Query optimization

5. **[shadcn/ui Standards](docs/shadcn-ui-standards.md)** ⚠️ CRITICAL
   - ALL UI elements MUST use shadcn/ui components
   - NO custom UI components allowed
   - Adding new shadcn components
   - Component variants and styling
   - Composition patterns
   - Server vs Client components

6. **[Authentication & Clerk](docs/authentication-clerk.md)**
   - Clerk v7.3.0 is the ONLY auth method
   - Protected route patterns (/dashboard)
   - Homepage redirect for authenticated users
   - Modal-only sign in/up
   - Server-side authentication
   - Database userId integration

## Critical Rules

### ⚠️ Next.js Version Notice

**This project uses Next.js 16.2.4 with breaking changes from earlier versions.** APIs, conventions, and file structure may differ significantly from your training data. Always verify against current documentation before writing code.

### 🔒 Security Requirements

1. **Always authenticate server-side** in API routes and Server Components
2. **Never expose sensitive data** to the client
3. **Verify resource ownership** before allowing modifications
4. **Validate all user input** on the server
5. **Use environment variables** for secrets (never hardcode)

### 📝 TypeScript Requirements

1. **Strict mode is enabled** - no implicit any
2. **Explicit return types** for all exported functions
3. **Proper async/await** with Promise types
4. **Use `@/` path alias** for imports
5. **Never use `any`** - use `unknown` instead

### 🎨 Component Requirements

1. **ALL UI elements MUST use shadcn/ui** - NEVER create custom UI components
2. **Server Components by default** - only use `"use client"` when necessary
3. **Use Tailwind utilities** - avoid custom CSS
4. **Add missing components** with `npx shadcn@latest add [component]`
5. **Handle loading and error states** gracefully

### 🗄️ Database Requirements

1. **Use Drizzle ORM** for all database operations
2. **Never run queries in Client Components**
3. **Always use transactions** for multi-step operations
4. **Associate data with userId** from Clerk
5. **Handle null values explicitly** with TypeScript

## Quick Reference

### Project Paths

- **Components:** `/components/ui/`, `/components/layout/`, `/components/features/`
- **Pages:** `/app/` (App Router)
- **API Routes:** `/app/api/`
- **Database:** `/db/schema.ts`, `/db/index.ts`
- **Utilities:** `/lib/`
- **Documentation:** `/docs/`

### Common Patterns

```typescript
// Import alias
import { Button } from '@/components/ui/button';
import { db } from '@/db';

// Server-side auth
import { auth } from '@clerk/nextjs/server';
const { userId } = await auth();

// Database query
import { eq } from 'drizzle-orm';
const links = await db.query.links.findMany({
  where: eq(links.userId, userId),
});

// API route
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... handle request
}
```

## How to Use These Instructions

### 🚨 MANDATORY WORKFLOW FOR EVERY TASK 🚨

1. **READ THE RELEVANT DOCUMENTATION FIRST** - Use `read_file` to read the appropriate `/docs/*.md` file(s) before writing ANY code
2. **Understand the patterns** - Review examples and requirements in the documentation
3. **Follow the documented patterns** - Do not deviate from the established conventions
4. **Consult multiple guides** when working across domains (e.g., API route with database = read both docs)
5. **Prioritize security** - Always follow authentication and data validation patterns from the docs
6. **Test thoroughly** - Consider edge cases, loading states, and error scenarios

### ⛔ NEVER DO THESE:

- ❌ Write code without reading the relevant documentation first
- ❌ Assume you know the pattern from training data
- ❌ Use outdated Next.js patterns (this is v16.2.4)
- ❌ Create custom UI components (must use shadcn/ui)
- ❌ Skip reading docs because the task seems "simple"

## When to Update These Instructions

- New patterns or conventions are established
- Breaking changes in dependencies
- Common mistakes identified
- Security vulnerabilities discovered
- Performance optimizations found

---

## \ud83d\udd04 Final Reminder

**EVERY time you are asked to write code:**

1. \u2705 FIRST: Read the relevant `/docs/*.md` file(s) with `read_file`
2. \u2705 THEN: Write code following those documented patterns
3. \u2705 VERIFY: Your code matches the examples and conventions in the docs

**This is not optional. This is mandatory. Every. Single. Time.**

---

**For detailed information on any topic, consult the specific documentation file in `/docs/`.**
