# Agent Instructions Documentation

This directory contains comprehensive coding standards and patterns for the Link Shortener project, designed to guide AI agents and developers in maintaining consistency and quality.

## 📚 Documentation Files

### [general-coding-standards.md](./general-coding-standards.md)

**Core principles and practices for the entire codebase**

- Project overview and philosophy
- File naming conventions and folder structure
- Code style and formatting rules
- Error handling patterns
- Performance optimization guidelines
- Security best practices
- Git commit message conventions
- Code review checklist
- Common anti-patterns to avoid

**When to use:** Starting any new feature, setting up project structure, reviewing code

---

### [nextjs-standards.md](./nextjs-standards.md)

**Next.js 16.2.4 App Router specific guidelines**

- App Router architecture and file conventions
- Server vs Client Component decision matrix
- Routing patterns and dynamic routes
- API route handlers
- Data fetching strategies
- Metadata and SEO configuration
- Navigation patterns
- Loading and error states
- Environment variables

**When to use:** Creating pages, API routes, layouts, or any Next.js-specific functionality

---

### [typescript-conventions.md](./typescript-conventions.md)

**TypeScript best practices and type safety guidelines**

- Type definitions and annotations
- Import path aliases
- React component typing
- Async/await patterns
- Type guards and runtime validation
- Generic types usage
- Handling null and undefined
- Type assertions best practices

**When to use:** Writing any TypeScript code, defining interfaces, working with types

---

### [database-patterns.md](./database-patterns.md)

**Drizzle ORM and Neon PostgreSQL integration**

- Schema definition with Drizzle
- Table relationships
- Database connection setup
- CRUD operation patterns
- Query building with operators
- Transactions
- Migrations workflow
- Aggregations and complex queries
- Error handling for database operations

**When to use:** Working with database schemas, queries, migrations, or data persistence

---

### [ui-component-patterns.md](./ui-component-patterns.md)

**UI components and styling with shadcn/ui and Tailwind CSS**

- shadcn/ui component usage
- Tailwind CSS v4 patterns
- Component composition
- Variant creation with CVA
- Responsive design patterns
- Accessibility guidelines
- Loading states and skeletons
- Error state components
- Icon usage with lucide-react

**When to use:** Building UI components, styling interfaces, creating layouts

---

### [authentication-clerk.md](./authentication-clerk.md)

**Clerk authentication integration and patterns**

- ClerkProvider setup
- UI components (SignIn, SignUp, UserButton, Show)
- Route protection with middleware
- Server-side authentication
- Client-side hooks (useUser, useAuth)
- Database integration with userId
- Authorization and ownership verification
- Webhooks for user events

**When to use:** Implementing authentication, protecting routes, user management

---

## 🎯 Quick Reference by Task

### Creating a New Feature

1. Read: general-coding-standards.md
2. Read: nextjs-standards.md
3. Read: Relevant domain documentation (UI, database, or auth)

### Building a New Page

1. Read: nextjs-standards.md (App Router conventions)
2. Read: typescript-conventions.md (Component typing)
3. Read: ui-component-patterns.md (Component structure)
4. Read: authentication-clerk.md (If protected)

### Creating an API Route

1. Read: nextjs-standards.md (API route patterns)
2. Read: authentication-clerk.md (Server-side auth)
3. Read: database-patterns.md (Database operations)
4. Read: typescript-conventions.md (Type safety)

### Working with Database

1. Read: database-patterns.md (Drizzle ORM usage)
2. Read: typescript-conventions.md (Type inference)
3. Read: authentication-clerk.md (Associating with users)

### Styling Components

1. Read: ui-component-patterns.md (Tailwind and shadcn/ui)
2. Read: general-coding-standards.md (Component structure)
3. Read: typescript-conventions.md (Props typing)

### Implementing Authentication

1. Read: authentication-clerk.md (Clerk integration)
2. Read: nextjs-standards.md (Middleware setup)
3. Read: database-patterns.md (User data storage)

---

## 🔍 Common Scenarios

### "How do I protect a page?"

→ [authentication-clerk.md](./authentication-clerk.md) - Route Protection section

### "Should this be a Server or Client Component?"

→ [nextjs-standards.md](./nextjs-standards.md) - Server vs Client Components section

### "How do I query the database?"

→ [database-patterns.md](./database-patterns.md) - Query Patterns section

### "What button variant should I use?"

→ [ui-component-patterns.md](./ui-component-patterns.md) - Button Component section

### "How do I handle errors in API routes?"

→ [nextjs-standards.md](./nextjs-standards.md) - API Routes section  
→ [general-coding-standards.md](./general-coding-standards.md) - Error Handling section

### "How do I get the current user?"

→ [authentication-clerk.md](./authentication-clerk.md) - Server-Side Authentication section

---

## 🚀 Getting Started as an Agent

1. **Read AGENTS.md** in the project root for overview
2. **Identify your task type** (page, component, API, database, etc.)
3. **Consult relevant documentation** before writing code
4. **Follow established patterns** from the guides
5. **Cross-reference multiple guides** for complex features

---

## 📝 Maintaining These Docs

### When to Update

- ✅ New architectural patterns established
- ✅ Dependency versions change significantly
- ✅ Common mistakes identified and solutions found
- ✅ Security vulnerabilities and fixes
- ✅ Performance optimizations discovered
- ✅ Team consensus on new conventions

### How to Update

1. Identify the appropriate document
2. Update the relevant section
3. Add examples if introducing new patterns
4. Update this README if structure changes
5. Update AGENTS.md if major changes occur

---

## 💡 Philosophy

These documents exist to:

1. **Maintain consistency** across the codebase
2. **Accelerate development** with proven patterns
3. **Reduce errors** through established best practices
4. **Improve code quality** with clear guidelines
5. **Enable AI agents** to write code that matches project standards

Every guideline should serve a purpose. If a rule no longer makes sense, update or remove it.

---

**Last Updated:** May 5, 2026  
**Maintained By:** Development Team  
**Version:** 1.0
