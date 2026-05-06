# General Coding Standards

## Project Overview

**Link Shortener Project** - A modern full-stack URL shortening application built with Next.js, TypeScript, Drizzle ORM, Clerk, and Neon PostgreSQL.

## Core Principles

1. **Type Safety First** - Use TypeScript strictly, avoid `any`
2. **Server-First** - Prefer Server Components and server-side logic
3. **Performance Matters** - Optimize for speed and minimal client JavaScript
4. **User Experience** - Handle loading and error states gracefully
5. **Security** - Always authenticate and authorize on the server
6. **Code Quality** - Write clean, readable, maintainable code

## Code Organization

### File Naming Conventions

- **Components:** PascalCase - `LinkCard.tsx`, `UserProfile.tsx`
- **Utilities:** camelCase - `generateShortCode.ts`, `validateUrl.ts`
- **Constants:** UPPER_SNAKE_CASE - `MAX_LINKS_PER_USER`, `DEFAULT_EXPIRY_DAYS`
- **Types/Interfaces:** PascalCase - `Link`, `UserSettings`, `ApiResponse`
- **Hooks:** camelCase with `use` prefix - `useLinks.ts`, `useClipboard.ts`

### Folder Structure

```
app/                    # Next.js App Router pages
  (auth)/              # Route group for auth pages
  api/                 # API routes
  dashboard/           # Dashboard pages
  l/                   # Short link redirects
components/
  ui/                  # shadcn/ui components
  layout/              # Layout components
  features/            # Feature-specific components
db/
  schema.ts            # Database schema
  index.ts             # Database connection
lib/
  utils.ts             # Utility functions
  constants.ts         # App constants
  validators.ts        # Validation functions
```

## Code Style

### Formatting

- **Indentation:** 2 spaces
- **Line Length:** Max 100 characters (soft limit)
- **Quotes:** Single quotes for strings, double quotes for JSX attributes
- **Semicolons:** Required
- **Trailing Commas:** Use in multi-line objects/arrays

### Variable Declarations

```typescript
// ✅ Good - const by default
const userId = 'user_123';
let counter = 0;

// ❌ Avoid - never use var
var x = 10;

// ✅ Good - descriptive names
const userLinkCount = await getUserLinkCount(userId);

// ❌ Avoid - abbreviations and single letters (except in loops)
const cnt = await getULC(uid);
```

### Function Definitions

```typescript
// ✅ Good - async/await syntax
async function fetchUserData(userId: string): Promise<User> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user;
}

// ✅ Good - arrow functions for inline
const filterActiveLinks = (links: Link[]) => links.filter(link => link.isActive);

// ❌ Avoid - promise chains
function fetchUserData(userId: string): Promise<User> {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  }).then(user => user);
}
```

## Error Handling

### Try-Catch Blocks

```typescript
async function createLink(data: NewLink) {
  try {
    const link = await db.insert(links).values(data).returning();
    return { success: true, data: link[0] };
  } catch (error) {
    console.error('Failed to create link:', error);
    return { success: false, error: 'Failed to create link' };
  }
}
```

### API Error Responses

```typescript
// Consistent error response format
type ErrorResponse = {
  error: string;
  code?: string;
  details?: unknown;
};

export async function POST(request: Request) {
  try {
    // ... logic
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
}
```

### User-Facing Errors

```typescript
// ✅ Good - user-friendly messages
throw new Error('Invalid URL format. Please enter a valid URL starting with http:// or https://');

// ❌ Avoid - technical jargon
throw new Error('RegEx validation failed on input string');
```

## Comments

### When to Comment

- **Do comment:** Complex algorithms, business logic, workarounds
- **Don't comment:** Obvious code, what the code does (self-documenting code is better)

```typescript
// ✅ Good - explains why
// Use SHA-256 hash to ensure unique short codes while maintaining randomness
const hash = createHash('sha256').update(url + Date.now()).digest('hex');

// ❌ Bad - explains what (obvious from code)
// Get the user ID from auth
const userId = await auth().userId;
```

### JSDoc for Public APIs

```typescript
/**
 * Generates a unique short code for a URL
 * @param url - The original URL to shorten
 * @param length - Desired length of the short code (default: 8)
 * @returns A unique alphanumeric short code
 */
export function generateShortCode(url: string, length: number = 8): string {
  // Implementation
}
```

## Environment Variables

### Naming Convention

```bash
# ✅ Good - descriptive and grouped
DATABASE_URL=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=

# ❌ Avoid - vague names
DB=
KEY=
URL=
```

### Validation

Always validate environment variables on startup:

```typescript
// lib/env.ts
function validateEnv() {
  const required = [
    'DATABASE_URL',
    'CLERK_SECRET_KEY',
    'CLERK_PUBLISHABLE_KEY',
  ];
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

validateEnv();
```

## Performance Optimization

### 1. Minimize Client JavaScript

```typescript
// ✅ Good - Server Component (no JS sent to client)
export default async function LinksPage() {
  const links = await getLinks();
  return <LinksList links={links} />;
}

// Only use Client Components when necessary
'use client';
export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. Database Query Optimization

```typescript
// ✅ Good - select only needed fields
const links = await db
  .select({
    id: links.id,
    shortCode: links.shortCode,
    clicks: links.clicks,
  })
  .from(links)
  .where(eq(links.userId, userId));

// ❌ Avoid - selecting everything when not needed
const allData = await db.select().from(links);
```

### 3. Use Proper Data Types

```typescript
// ✅ Good - specific types
type LinkStatus = 'active' | 'inactive' | 'expired';
const clicks: number = 0;

// ❌ Avoid - generic types
const status: string = 'active';
const clicks: any = 0;
```

## Testing Mindset

While writing code, consider:

1. **Edge Cases:** What if input is null/undefined/empty?
2. **Error States:** What if the API call fails?
3. **Loading States:** How does this look while data loads?
4. **Empty States:** What if there's no data?
5. **Authentication:** What if user is not logged in?
6. **Permissions:** Can this user access this resource?

## Security Best Practices

1. **Never trust client input** - Always validate and sanitize
2. **Authenticate server-side** - Check auth in API routes and Server Components
3. **Verify resource ownership** - Users should only access their own data
4. **Use environment variables** for secrets
5. **Sanitize URLs** before storing or redirecting
6. **Rate limit** API endpoints to prevent abuse
7. **Use HTTPS** in production (enforce in middleware)
8. **Validate and escape** user-generated content

## Git Commit Messages

Follow conventional commits:

```bash
# Format: <type>(<scope>): <description>

feat(links): add link expiration feature
fix(auth): resolve sign-out redirect issue
docs(readme): update installation steps
refactor(db): optimize link query performance
style(ui): improve button spacing
test(api): add link creation tests
chore(deps): update Next.js to 16.2.4
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Code Review Checklist

Before submitting code:

- [ ] TypeScript has no errors
- [ ] All functions have proper type annotations
- [ ] Environment variables are validated
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Authentication/authorization is verified server-side
- [ ] Code is formatted consistently
- [ ] No console.logs in production code
- [ ] Comments explain "why", not "what"
- [ ] Responsive design tested
- [ ] Accessibility considered

## Anti-Patterns to Avoid

### ❌ Mixing Server and Client Logic

```typescript
// ❌ Bad - database call in Client Component
'use client';
export function Links() {
  const links = await db.query.links.findMany(); // ERROR!
  return <div>{links.map(...)}</div>;
}
```

### ❌ Using `any` Type

```typescript
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
```

### ❌ Ignoring Errors

```typescript
// ❌ Bad
try {
  await riskyOperation();
} catch (error) {
  // Silent failure
}

// ✅ Good
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  // Handle appropriately
}
```

### ❌ Not Awaiting Promises

```typescript
// ❌ Bad
const params = params; // params is Promise<{ id: string }>
const id = params.id; // ERROR!

// ✅ Good
const { id } = await params;
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
