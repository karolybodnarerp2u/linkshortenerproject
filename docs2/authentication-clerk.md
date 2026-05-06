# Authentication & Clerk Patterns

## Overview

This project uses **Clerk v7.3.0** for authentication and user management.

## Setup

### ClerkProvider

The entire app is wrapped in `ClerkProvider` in the root layout:

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

## UI Components

### Sign In/Sign Up Buttons

Use Clerk's built-in components with the `Show` component for conditional rendering:

```typescript
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <h1>Link Shortener</h1>
        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
          </Show>
          <Show when="signed-in">
            <UserButton afterSignOutUrl="/" />
          </Show>
        </div>
      </div>
    </header>
  );
}
```

### Show Component

The `Show` component conditionally renders based on auth state:

```typescript
<Show when="signed-in">
  {/* Only visible to authenticated users */}
  <UserDashboard />
</Show>

<Show when="signed-out">
  {/* Only visible to unauthenticated users */}
  <LandingPage />
</Show>
```

## Route Protection

### Middleware

Protect routes using `proxy.ts` (or `middleware.ts`):

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/l/:shortCode', // Public short link redirects
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
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

## Server-Side Authentication

### In Server Components

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  // Get auth state
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  // Get full user object
  const user = await currentUser();
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
    </div>
  );
}
```

### In API Routes

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Process authenticated request
  const body = await request.json();
  
  // Use userId for database operations
  const link = await createLink({
    ...body,
    userId, // Associate with authenticated user
  });
  
  return NextResponse.json(link);
}
```

### Getting User Email

```typescript
import { currentUser } from '@clerk/nextjs/server';

export async function getUserEmail(): Promise<string | null> {
  const user = await currentUser();
  return user?.emailAddresses[0]?.emailAddress ?? null;
}
```

## Client-Side Authentication

### useUser Hook

For Client Components:

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
  
  return (
    <div>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  );
}
```

### useAuth Hook

For authentication state and actions:

```typescript
'use client';

import { useAuth } from '@clerk/nextjs';

export function ProtectedComponent() {
  const { isLoaded, userId, signOut } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!userId) {
    return <div>Unauthorized</div>;
  }
  
  return (
    <div>
      <p>User ID: {userId}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

## Database Integration

### Storing User ID

Always associate user data with Clerk's userId:

```typescript
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';

export async function createUserLink(url: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  const [link] = await db
    .insert(links)
    .values({
      userId,           // Clerk user ID
      originalUrl: url,
      shortCode: generateShortCode(),
    })
    .returning();
  
  return link;
}
```

### Querying User Data

```typescript
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserLinks() {
  const { userId } = await auth();
  
  if (!userId) {
    return [];
  }
  
  return db.query.links.findMany({
    where: eq(links.userId, userId),
    orderBy: [desc(links.createdAt)],
  });
}
```

## Authorization Patterns

### Resource Ownership Check

```typescript
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function canModifyLink(linkId: string): Promise<boolean> {
  const { userId } = await auth();
  
  if (!userId) {
    return false;
  }
  
  const link = await db.query.links.findFirst({
    where: and(
      eq(links.id, linkId),
      eq(links.userId, userId)
    ),
  });
  
  return !!link;
}
```

### Protected API Route Pattern

```typescript
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Verify ownership
  const link = await db.query.links.findFirst({
    where: and(
      eq(links.id, id),
      eq(links.userId, userId)
    ),
  });
  
  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  // Perform deletion
  await db.delete(links).where(eq(links.id, id));
  
  return NextResponse.json({ success: true });
}
```

## User Metadata

### Storing Additional User Data

```typescript
import { currentUser } from '@clerk/nextjs/server';

// Get public metadata
const user = await currentUser();
const customData = user?.publicMetadata;

// Update metadata (requires Clerk API)
import { clerkClient } from '@clerk/nextjs/server';

await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    role: 'admin',
    subscription: 'pro',
  },
});
```

## Webhooks

### Handling User Events

Create a webhook endpoint to sync user events:

```typescript
// app/api/webhooks/clerk/route.ts
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');
  
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing headers', { status: 400 });
  }
  
  const payload = await request.json();
  const body = JSON.stringify(payload);
  
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  
  let event: WebhookEvent;
  
  try {
    event = webhook.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    return new Response('Invalid signature', { status: 400 });
  }
  
  // Handle events
  switch (event.type) {
    case 'user.created':
      // Create user record in database
      break;
    case 'user.updated':
      // Update user record
      break;
    case 'user.deleted':
      // Delete or anonymize user data
      break;
  }
  
  return new Response('OK', { status: 200 });
}
```

## Best Practices

1. **Always use `await auth()` or `await currentUser()`** in Server Components and API routes
2. **Never expose sensitive user data** to the client
3. **Use middleware** for route protection rather than component-level checks
4. **Store only userId** in your database, not full user objects
5. **Verify ownership** before modifying user resources
6. **Use Show component** for conditional UI based on auth state
7. **Handle loading states** with `isLoaded` checks
8. **Use webhooks** for syncing user data to your database
9. **Protect API routes** with auth checks at the beginning
10. **Use proper error handling** for unauthorized access
11. **Test auth flows** for both signed-in and signed-out states
12. **Keep auth logic server-side** when possible for security
13. **Use environment variables** for Clerk keys (never hardcode)
14. **Set proper afterSignInUrl and afterSignUpUrl** for better UX
