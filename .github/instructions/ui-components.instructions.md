---
description: Read this before creating or modifying UI components in the project.
---

# shadcn/ui Standards

## Core Rule

**ALL UI elements MUST use shadcn/ui components. DO NOT create custom UI components.**

## Component Library

- **Primary Library:** shadcn/ui with @base-ui/react primitives
- **Icons:** lucide-react
- **Styling:** Tailwind CSS v4 utilities only

## Adding New Components

When you need a UI component that doesn't exist yet, add it from shadcn/ui:

```bash
npx shadcn@latest add [component-name]
```

Examples:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
```

All components are installed to `/components/ui/`.

## Usage Patterns

### Import from shadcn/ui

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

### Use Component Variants

shadcn/ui components come with built-in variants:

```typescript
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### Styling with Tailwind

Extend shadcn components with Tailwind utilities via `className`:

```typescript
<Button className="w-full mt-4">
  Full Width Button
</Button>

<Card className="shadow-lg hover:shadow-xl transition-shadow">
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Class Merging

Use `cn()` utility for conditional classes:

```typescript
import { cn } from '@/lib/utils';

<Button
  className={cn(
    "w-full",
    isPending && "opacity-50 cursor-not-allowed"
  )}
>
  Submit
</Button>
```

## Composition Allowed

You can **compose** shadcn components into feature-specific components:

```typescript
// ✅ Good - Composing shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function LinkCard({ link }: { link: Link }) {
  return (
    <Card>
      <CardHeader>{link.title}</CardHeader>
      <CardContent>
        <p>{link.url}</p>
        <Button variant="outline" className="mt-2">
          Copy
        </Button>
      </CardContent>
    </Card>
  );
}

// ❌ Bad - Creating custom primitive components
export function CustomButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="custom-button">
      {children}
    </button>
  );
}
```

## What You Cannot Do

❌ Create custom button, input, card, or any UI primitive components  
❌ Use HTML elements directly for interactive UI (use shadcn components)  
❌ Install other UI component libraries  
❌ Write custom CSS for component styling (use Tailwind utilities)

## What You Can Do

✅ Compose shadcn components into feature components  
✅ Add new shadcn components as needed  
✅ Extend components with Tailwind classes  
✅ Use shadcn component variants and props  
✅ Create layout components that organize shadcn components

## Common Components

Available in `/components/ui/`:

- `button` - All button interactions
- `input` - Text inputs
- `card` - Content containers
- `dialog` - Modals and dialogs
- `form` - Form wrappers
- `label` - Form labels
- `select` - Dropdowns
- `checkbox`, `radio-group` - Form inputs

**If a component isn't installed, add it with `npx shadcn@latest add [name]`**

## Server vs Client Components

Most shadcn components require `"use client"` because they use interactivity:

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function InteractiveComponent() {
  const [count, setCount] = useState(0);

  return (
    <Button onClick={() => setCount(count + 1)}>
      Count: {count}
    </Button>
  );
}
```

**Static shadcn components (like `Card`) can be used in Server Components without `"use client"`.**

## Quick Reference

```typescript
// Import pattern
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Basic usage
<Button>Click Me</Button>

// With variants
<Button variant="outline" size="sm">Small Outline</Button>

// With Tailwind classes
<Button className="w-full bg-blue-600">Custom Styled</Button>

// Conditional classes
<Button className={cn("base-classes", isActive && "active-classes")}>
  Toggle
</Button>
```

---

**Remember: If it's a UI element, it comes from shadcn/ui. No exceptions.**
