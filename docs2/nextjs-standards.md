# Next.js Coding Standards

## Critical Framework Information

**This project uses Next.js 16.2.4 with the App Router** - APIs and conventions may differ significantly from earlier versions. Always verify against current documentation.

## Project Structure

### App Router Architecture

- Use the `/app` directory for all routes and layouts
- File-based routing with `page.tsx`, `layout.tsx`, `route.ts` patterns
- Server Components by default; use `"use client"` directive only when necessary

### When to Use Server vs Client Components

**Server Components (default):**

- Data fetching and database queries
- Accessing backend resources directly
- Large dependencies that don't need client-side JavaScript
- Static content and metadata

**Client Components (`"use client"`):**

- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, etc.)
- Interactive UI components

## Routing Patterns

### File Conventions

```
app/
  page.tsx              # Home route (/)
  layout.tsx            # Root layout
  loading.tsx           # Loading UI
  error.tsx             # Error boundary
  not-found.tsx         # 404 page
  api/
    route.ts            # API route handler
  [slug]/
    page.tsx            # Dynamic route
```

### API Routes

- Use `route.ts` files for API endpoints
- Export named functions: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
- Return `Response` or `NextResponse` objects
- Handle errors with try-catch and appropriate HTTP status codes

**Example:**

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Process request
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
```

## Data Fetching

### Server-Side Data Fetching

- Fetch data directly in Server Components
- Use `async/await` with fetch or database queries
- No need for useEffect or useState for initial data

```typescript
// app/page.tsx
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### Revalidation

- Use `revalidate` for time-based revalidation
- Use `revalidatePath()` or `revalidateTag()` for on-demand revalidation
- Configure in `fetch()` calls or route segment config

## Metadata

### Static Metadata

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

### Dynamic Metadata

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Item ${params.id}`,
  };
}
```

## Environment Variables

- Use `.env.local` for local secrets (never commit)
- Prefix client-side variables with `NEXT_PUBLIC_`
- Access server-side: `process.env.VARIABLE_NAME`
- Access client-side: `process.env.NEXT_PUBLIC_VARIABLE_NAME`

## Performance Best Practices

1. **Minimize Client JavaScript:** Keep most components as Server Components
2. **Code Splitting:** Next.js automatically code-splits; use dynamic imports for heavy components
3. **Image Optimization:** Always use `next/image` for images
4. **Font Optimization:** Use `next/font` for web fonts (already configured with Geist fonts)
5. **Streaming:** Use `loading.tsx` for instant loading states

## Common Patterns

### Loading States

```typescript
// app/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

### Error Handling

```typescript
// app/error.tsx
'use client';

export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## Navigation

- Use `<Link>` from `next/link` for client-side navigation
- Use `redirect()` for server-side redirects
- Use `useRouter()` hook from `next/navigation` for programmatic navigation in Client Components

## Best Practices

1. **Always validate environment variables** at runtime
2. **Use TypeScript** for all files
3. **Follow the App Router conventions** - don't mix with Pages Router patterns
4. **Keep data fetching close to where it's used**
5. **Use Suspense boundaries** for better streaming and UX
6. **Avoid unnecessary "use client"** - start with Server Components
7. **Handle errors gracefully** with error.tsx boundaries
