# UI & Component Patterns

## Component Library

This project uses **shadcn/ui** with **@base-ui/react** as the underlying primitive library.

## Component Architecture

### Directory Structure

```
components/
  ui/              # shadcn/ui components (button, input, etc.)
    button.tsx
    input.tsx
    card.tsx
  layout/          # Layout components (header, footer, etc.)
  features/        # Feature-specific components
```

## Styling

### Tailwind CSS v4

This project uses **Tailwind CSS v4** with the new PostCSS plugin architecture.

### Utility-First Approach

Always use Tailwind utility classes for styling:

```typescript
// ✅ Good
<div className="flex items-center gap-4 p-4 rounded-lg bg-background">
  <h1 className="text-2xl font-bold">Title</h1>
</div>

// ❌ Avoid custom CSS unless absolutely necessary
<div style={{ display: 'flex', padding: '1rem' }}>
  <h1>Title</h1>
</div>
```

### Class Merging with `cn()`

Use the `cn()` utility from `@/lib/utils` for conditional and merged class names:

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  variant === 'primary' && "bg-primary text-primary-foreground",
  variant === 'secondary' && "bg-secondary text-secondary-foreground",
  isDisabled && "opacity-50 pointer-events-none"
)} />
```

## Component Variants

### Using Class Variance Authority (CVA)

Create component variants using `cva`:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  // Base classes
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        destructive: "border-destructive",
        success: "border-green-500",
      },
      size: {
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ variant, size, className, children }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, size }), className)}>
      {children}
    </div>
  );
}
```

## shadcn/ui Component Patterns

### Button Component

The project uses `@base-ui/react/button` as the primitive:

```typescript
import { Button } from '@/components/ui/button';

// Usage
<Button variant="default" size="md">Click me</Button>
<Button variant="outline" size="sm">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>
```

### Form Components

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function LinkForm() {
  const [url, setUrl] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
        placeholder="Enter URL"
        required
      />
      <Button type="submit">Shorten</Button>
    </form>
  );
}
```

## Layout Components

### Page Layout Pattern

```typescript
interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function PageLayout({ children, header, sidebar }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {header && <header className="border-b">{header}</header>}
      <div className="flex flex-1">
        {sidebar && <aside className="w-64 border-r">{sidebar}</aside>}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

## Composition Patterns

### Compound Components

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg border bg-card shadow-sm", className)}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className }: CardProps) {
  return <div className={cn("p-4 border-b", className)}>{children}</div>;
};

Card.Body = function CardBody({ children, className }: CardProps) {
  return <div className={cn("p-4", className)}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className }: CardProps) {
  return <div className={cn("p-4 border-t", className)}>{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

## Responsive Design

Use Tailwind's responsive prefixes:

```typescript
<div className={cn(
  "grid gap-4",
  "grid-cols-1",           // Mobile: 1 column
  "sm:grid-cols-2",        // Small screens: 2 columns
  "lg:grid-cols-3",        // Large screens: 3 columns
  "xl:grid-cols-4"         // Extra large: 4 columns
)}>
  {/* Grid items */}
</div>
```

## Accessibility

### Semantic HTML

Always use semantic HTML elements:

```typescript
// ✅ Good
<button onClick={handleClick}>Click me</button>
<nav>...</nav>
<main>...</main>
<article>...</article>

// ❌ Avoid
<div onClick={handleClick}>Click me</div>
```

### ARIA Attributes

Add ARIA attributes when necessary:

```typescript
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
>
  Menu
</button>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```typescript
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  Custom button
</div>
```

## Icon Usage

Use `lucide-react` for icons:

```typescript
import { Link, Copy, Check } from 'lucide-react';

<Button>
  <Link className="size-4" />
  Create Link
</Button>
```

## Loading States

### Skeleton Components

```typescript
export function LinkSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
    </div>
  );
}
```

### Spinners

```typescript
export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", className)} />
  );
}
```

## Error States

```typescript
interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title = "Error", message, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <h3 className="font-semibold text-destructive">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}
```

## Best Practices

1. **Use Server Components by default** - only add `"use client"` when needed
2. **Compose components** - build complex UIs from simple, reusable pieces
3. **Use Tailwind utilities** - avoid custom CSS
4. **Leverage CVA** for variant-based components
5. **Use the `cn()` utility** for conditional classes
6. **Keep components focused** - single responsibility principle
7. **Extract reusable logic** into custom hooks
8. **Use TypeScript** for all component props
9. **Make components accessible** - use semantic HTML and ARIA
10. **Optimize images** - always use `next/image`
11. **Use proper loading states** - skeletons, spinners, Suspense
12. **Handle errors gracefully** - show user-friendly error messages
13. **Follow shadcn/ui patterns** - maintain consistency with existing components
14. **Test responsive layouts** - use Tailwind's responsive utilities
