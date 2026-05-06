# TypeScript Conventions

## Configuration

This project uses **strict TypeScript mode** as defined in `tsconfig.json`. All type safety features are enabled.

## Import Aliases

Use the `@/` path alias for cleaner imports:

```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { db } from '@/db';

// ❌ Avoid
import { Button } from '../../../components/ui/button';
```

## Type Definitions

### Explicit Return Types

Always specify return types for functions, especially exported ones:

```typescript
// ✅ Good
export function getUserById(id: string): Promise<User | null> {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}

// ❌ Avoid
export function getUserById(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}
```

### Type vs Interface

**Use `type` for:**
- Union types
- Intersection types
- Mapped types
- Type aliases

**Use `interface` for:**
- Object shapes that may be extended
- Public APIs
- React component props

```typescript
// Types
type Status = 'active' | 'inactive' | 'pending';
type UserWithLinks = User & { links: Link[] };

// Interfaces
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface ButtonProps {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

## React Component Types

### Function Components

Use explicit typing for component props:

```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  // Component logic
}
```

### Client Component Props

```typescript
'use client';

interface FormProps {
  onSubmit: (data: FormData) => void;
  initialValue?: string;
  disabled?: boolean;
}

export function Form({ onSubmit, initialValue = '', disabled = false }: FormProps) {
  // Component logic
}
```

## Async/Await

Always use proper async/await typing:

```typescript
async function fetchUserData(userId: string): Promise<UserData> {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}
```

## Type Guards

Use type guards for runtime type checking:

```typescript
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

try {
  // risky operation
} catch (error) {
  if (isError(error)) {
    console.error(error.message);
  }
}
```

## Null Handling

Handle nullable values explicitly:

```typescript
// ✅ Good
function getDisplayName(user: User | null): string {
  return user?.name ?? 'Anonymous';
}

// ✅ Good - with type narrowing
function processUser(user: User | null): void {
  if (!user) return;
  
  // TypeScript knows user is not null here
  console.log(user.name);
}
```

## Enums vs Union Types

Prefer union types over enums for better type safety and smaller bundle size:

```typescript
// ✅ Preferred
type LinkStatus = 'active' | 'inactive' | 'expired';

// ❌ Avoid unless necessary
enum LinkStatus {
  Active = 'active',
  Inactive = 'inactive',
  Expired = 'expired',
}
```

## Generic Types

Use generics for reusable, type-safe code:

```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// Usage
const userResponse = await fetchApi<User>('/api/user');
```

## Type Assertions

Use type assertions sparingly and only when you're certain:

```typescript
// ✅ Acceptable when you know the shape
const data = JSON.parse(jsonString) as UserData;

// ✅ Better - with validation
function isUserData(obj: unknown): obj is UserData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}

const parsed = JSON.parse(jsonString);
if (isUserData(parsed)) {
  // TypeScript knows this is UserData
  console.log(parsed.name);
}
```

## Never Use `any`

Avoid `any` at all costs. Use `unknown` when the type is truly unknown:

```typescript
// ❌ Bad
function handleError(error: any) {
  console.log(error.message);
}

// ✅ Good
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log('An unknown error occurred');
  }
}
```

## Const Assertions

Use `as const` for literal types:

```typescript
const LINK_STATUSES = ['active', 'inactive', 'expired'] as const;
type LinkStatus = typeof LINK_STATUSES[number]; // 'active' | 'inactive' | 'expired'

const CONFIG = {
  maxLinks: 100,
  defaultExpiry: 30,
} as const;
```

## Best Practices

1. **Enable all strict flags** in tsconfig.json (already configured)
2. **No implicit any** - always specify types
3. **Use readonly** for immutable data structures
4. **Leverage type inference** where obvious, but be explicit for public APIs
5. **Use discriminated unions** for complex state management
6. **Validate external data** at runtime, don't just trust types
7. **Keep types close to usage** - define types in the same file when possible
8. **Export shared types** from a central location for reuse
