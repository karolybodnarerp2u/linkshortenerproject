# Authentication Standards - Clerk

## Core Authentication Rules

### ⚠️ Authentication Provider

**Clerk v7.3.0 is the ONLY authentication method used in this application.**

- ❌ Never implement custom authentication (JWT, sessions, cookies, etc.)
- ❌ Never use any other auth providers (NextAuth, Auth0, Firebase Auth, etc.)
- ✅ Always use Clerk for all authentication and user management

## Setup

### ClerkProvider Configuration

The entire app is wrapped in `ClerkProvider` in the root layout with the shadcn theme:

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider
          appearance={{
            baseTheme: shadcn,
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

**Note:** The `baseTheme: shadcn` configuration ensures that Clerk UI components (SignIn, SignUp, UserButton, etc.) match the shadcn/ui design system used throughout the application.

**Package Required:** `npm install @clerk/themes`

## Route Protection

### Protected Routes

**The `/dashboard` page MUST be protected:**

```typescript
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }
  
  // Dashboard content
}
```

### Homepage Redirect

**Authenticated users visiting the homepage MUST be redirected to `/dashboard`:**

```typescript
// app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect('/dashboard');
  }
  
  // Homepage content for unauthenticated users
}
```

## Clerk UI Components

### Modal Authentication

**Sign in and sign up MUST always launch as modals:**

```typescript
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

// ✅ Correct - Modal mode
<SignInButton mode="modal">
  <button>Sign In</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>Sign Up</button>
</SignUpButton>

// ❌ Incorrect - Page redirect
<SignInButton mode="redirect">
  <button>Sign In</button>
</SignInButton>
```

### User Button

Display the UserButton for signed-in users:

```typescript
import { UserButton } from '@clerk/nextjs';

<UserButton afterSignOutUrl="/" />
```

## Server-Side Authentication

### API Routes

Always verify authentication in API routes:

```typescript
// app/api/links/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Handle authenticated request
}
```

### Server Components

Use `auth()` to get the current user in Server Components:

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

// Get userId only
const { userId } = await auth();

// Get full user object (when needed)
const user = await currentUser();
```

## Client-Side Authentication

### Client Components

Use hooks only in Client Components:

```typescript
'use client';

import { useUser } from '@clerk/nextjs';

export function UserProfile() {
  const { isSignedIn, user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }
  
  return <div>Hello, {user.firstName}!</div>;
}
```

## Database Integration

### Linking Users to Data

Always associate database records with Clerk userId:

```typescript
// db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  shortCode: text('short_code').notNull().unique(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Querying User Data

Always filter by userId:

```typescript
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { links } from '@/db/schema';

const { userId } = await auth();

const userLinks = await db.query.links.findMany({
  where: eq(links.userId, userId),
});
```

## Security Checklist

- ✅ All authentication handled by Clerk
- ✅ `/dashboard` requires authentication
- ✅ Logged-in users redirected from homepage to `/dashboard`
- ✅ Sign in/up always launch as modals
- ✅ Server-side authentication in API routes
- ✅ Database records associated with userId
- ✅ Resource ownership verified before modifications

## Common Patterns

### Conditional Rendering Based on Auth

```typescript
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

<SignedOut>
  <SignInButton mode="modal">Sign In</SignInButton>
</SignedOut>

<SignedIn>
  <UserButton />
</SignedIn>
```

### Middleware (Optional)

For protecting multiple routes:

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

---

**Remember:** Clerk handles all authentication complexity. Never implement custom auth solutions or use alternative providers.
