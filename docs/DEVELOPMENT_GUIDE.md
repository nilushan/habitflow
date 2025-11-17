# HabitFlow - Development Guide

**Version:** 1.0
**Date:** 2025-11-17

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Testing Guidelines](#testing-guidelines)
5. [Git Workflow](#git-workflow)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
- Node.js 20+ (use `nvm` or `fnm`)
- pnpm 9+ (`npm install -g pnpm`)
- PostgreSQL 16+ (or use Vercel Postgres)
- Git

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/habitflow.git
cd habitflow

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Fill in required environment variables
# - DATABASE_URL
# - ANTHROPIC_API_KEY
# - CLERK_SECRET_KEY (or NextAuth config)

# 5. Run database migrations
pnpm db:push

# 6. Seed database (optional)
pnpm db:seed

# 7. Start development server
pnpm dev
```

Visit `http://localhost:3000` 🎉

---

## Development Workflow

We follow **TDD (Test-Driven Development)** and **Feature Branch Workflow**.

### TDD Cycle (Red-Green-Refactor)

**Example: Adding a new feature (Calculate Habit Streak)**

#### 1. RED: Write a failing test

```typescript
// __tests__/services/habit-service.test.ts
import { describe, it, expect } from 'vitest';
import { calculateStreak } from '@/services/habit-service';

describe('calculateStreak', () => {
  it('should return 0 for a habit with no logs', () => {
    const logs = [];
    const streak = calculateStreak(logs);
    expect(streak).toBe(0);
  });

  it('should return 3 for 3 consecutive days', () => {
    const logs = [
      { date: '2025-01-03', completed: true },
      { date: '2025-01-02', completed: true },
      { date: '2025-01-01', completed: true }
    ];
    const streak = calculateStreak(logs);
    expect(streak).toBe(3);
  });

  it('should break streak on missed day', () => {
    const logs = [
      { date: '2025-01-03', completed: true },
      { date: '2025-01-02', completed: false }, // Missed!
      { date: '2025-01-01', completed: true }
    ];
    const streak = calculateStreak(logs);
    expect(streak).toBe(1); // Only Jan 3
  });
});
```

Run the test:
```bash
pnpm test
# ❌ FAIL: calculateStreak is not defined
```

#### 2. GREEN: Write minimal code to pass

```typescript
// src/services/habit-service.ts
export function calculateStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;

  let streak = 0;
  for (const log of logs) {
    if (!log.completed) break;
    streak++;
  }
  return streak;
}
```

Run the test:
```bash
pnpm test
# ✅ PASS: All tests passing
```

#### 3. REFACTOR: Improve code quality

```typescript
// src/services/habit-service.ts
export function calculateStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;

  // Logs should be sorted by date descending (most recent first)
  const sortedLogs = [...logs].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);

    // Check if log is from today or yesterday (consecutive)
    const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 1) break; // Streak broken
    if (!log.completed) break; // Missed day

    streak++;
    currentDate = logDate; // Move to previous day
  }

  return streak;
}
```

Run tests again:
```bash
pnpm test
# ✅ PASS: All tests still passing
```

---

### Feature Development Process

**Step-by-step for each new feature:**

```bash
# 1. Create feature branch
git checkout -b feature/habit-streak-calculation

# 2. Write tests (TDD: Red)
# Create __tests__/services/habit-service.test.ts

# 3. Run tests (should fail)
pnpm test

# 4. Implement feature (TDD: Green)
# Create src/services/habit-service.ts

# 5. Refactor (TDD: Refactor)
# Improve code quality, add edge case handling

# 6. Run all tests
pnpm test

# 7. Lint and format
pnpm lint
pnpm format

# 8. Type check
pnpm type-check

# 9. Commit changes
git add .
git commit -m "feat: add habit streak calculation"

# 10. Push and create PR
git push origin feature/habit-streak-calculation
# Open PR on GitHub
```

---

## Code Standards

### TypeScript Guidelines

#### Use Strict Types
```typescript
// ❌ Bad
function createHabit(data: any) {
  // ...
}

// ✅ Good
interface CreateHabitInput {
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: Frequency;
}

function createHabit(data: CreateHabitInput): Habit {
  // ...
}
```

#### Use Zod for Runtime Validation
```typescript
import { z } from 'zod';

const CreateHabitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.enum(['health', 'work', 'learning', 'social', 'other']),
  frequency: z.union([
    z.object({ type: z.literal('daily') }),
    z.object({ type: z.literal('weekly'), days: z.array(z.string()) })
  ])
});

type CreateHabitInput = z.infer<typeof CreateHabitSchema>;
```

#### Prefer Type Inference
```typescript
// ❌ Unnecessary explicit type
const habits: Habit[] = await getHabits(userId);

// ✅ Let TypeScript infer
const habits = await getHabits(userId); // Inferred as Habit[]
```

### React Component Guidelines

#### Use Server Components by Default (Next.js 15)
```typescript
// app/habits/page.tsx (Server Component)
export default async function HabitsPage() {
  const habits = await getHabits(); // Direct DB call

  return <HabitList habits={habits} />;
}
```

#### Use Client Components Only When Needed
```typescript
// components/habit-checkbox.tsx
'use client';

import { useState } from 'react';

export function HabitCheckbox({ habitId }: { habitId: string }) {
  const [checked, setChecked] = useState(false);

  const handleToggle = async () => {
    setChecked(!checked);
    await toggleHabit(habitId);
  };

  return <input type="checkbox" checked={checked} onChange={handleToggle} />;
}
```

#### Component Structure
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types
interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
}

// 3. Component
export function HabitCard({ habit, onComplete }: HabitCardProps) {
  // 4. Hooks
  const [loading, setLoading] = useState(false);

  // 5. Event handlers
  const handleComplete = async () => {
    setLoading(true);
    await onComplete(habit.id);
    setLoading(false);
  };

  // 6. Render
  return (
    <div className="rounded-lg border p-4">
      <h3>{habit.name}</h3>
      <Button onClick={handleComplete} disabled={loading}>
        Complete
      </Button>
    </div>
  );
}
```

### API Route Guidelines

#### Use Next.js App Router API Routes
```typescript
// app/api/habits/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

const CreateHabitSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['health', 'work', 'learning', 'social', 'other'])
});

export async function POST(request: Request) {
  // 1. Authenticate
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Validate input
  const body = await request.json();
  const result = CreateHabitSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // 3. Business logic
  const habit = await createHabit(userId, result.data);

  // 4. Return response
  return NextResponse.json(habit, { status: 201 });
}
```

### Database Queries

#### Use Drizzle ORM (Type-safe)
```typescript
import { db } from '@/lib/db';
import { habits, habitLogs } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';

// ✅ Type-safe query
export async function getHabitsWithRecentLogs(userId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return await db
    .select()
    .from(habits)
    .leftJoin(habitLogs, eq(habits.id, habitLogs.habitId))
    .where(
      and(
        eq(habits.userId, userId),
        gte(habitLogs.date, thirtyDaysAgo)
      )
    );
}
```

---

## Testing Guidelines

### Test Structure (AAA Pattern)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('HabitService', () => {
  describe('calculateStreak', () => {
    it('should calculate streak correctly for consecutive days', () => {
      // Arrange
      const logs = [
        { date: '2025-01-03', completed: true },
        { date: '2025-01-02', completed: true },
        { date: '2025-01-01', completed: true }
      ];

      // Act
      const streak = calculateStreak(logs);

      // Assert
      expect(streak).toBe(3);
    });
  });
});
```

### Unit Tests (Vitest)
- Test pure functions (no side effects)
- Mock external dependencies
- Fast execution (< 1ms per test)

```typescript
import { vi } from 'vitest';

// Mock external API
vi.mock('@/lib/ai/claude', () => ({
  generateInsights: vi.fn().mockResolvedValue({ trends: [] })
}));
```

### Integration Tests (Playwright)
- Test API routes
- Test database operations
- Use test database

```typescript
import { test, expect } from '@playwright/test';

test('should create habit via API', async ({ request }) => {
  const response = await request.post('/api/habits', {
    data: {
      name: 'Morning meditation',
      category: 'health'
    },
    headers: {
      Authorization: 'Bearer test-token'
    }
  });

  expect(response.status()).toBe(201);
  const habit = await response.json();
  expect(habit.name).toBe('Morning meditation');
});
```

### E2E Tests (Playwright)
- Test critical user flows
- Run in CI before deploy

```typescript
import { test, expect } from '@playwright/test';

test('user can create and complete habit', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Create habit
  await page.goto('/habits');
  await page.click('text=New Habit');
  await page.fill('[name="name"]', 'Morning run');
  await page.selectOption('[name="category"]', 'health');
  await page.click('button:has-text("Create")');

  // Verify created
  await expect(page.locator('text=Morning run')).toBeVisible();

  // Mark complete
  await page.click('[data-testid="habit-checkbox"]');
  await expect(page.locator('text=Streak: 1')).toBeVisible();
});
```

---

## Git Workflow

### Branch Naming Convention

```
feature/habit-streak-calculation
fix/journal-date-timezone-bug
refactor/ai-service-abstraction
docs/update-architecture
test/add-habit-service-tests
```

### Commit Message Convention (Conventional Commits)

```
feat: add habit streak calculation
fix: correct timezone handling in journal dates
refactor: extract AI service abstraction layer
docs: update architecture diagram
test: add unit tests for habit service
chore: update dependencies
```

### Pull Request Process

1. **Create PR** with descriptive title
2. **Fill PR template**:
   - Description
   - Screenshots (if UI change)
   - Testing steps
   - Checklist (tests, docs, lint)
3. **Request review** from team
4. **Address feedback**
5. **Squash and merge** when approved

---

## Best Practices

### 1. Privacy & Security

#### Never log sensitive data
```typescript
// ❌ Bad
console.log('User data:', user);

// ✅ Good
console.log('User ID:', user.id);
```

#### Anonymize before AI calls
```typescript
// ✅ Always use anonymization layer
const anonData = await anonymizeForAI(userId, journalEntry);
const insights = await claude.generateInsights(anonData);
```

### 2. Performance

#### Use Server Components for data fetching
```typescript
// ✅ No client-side fetch, no loading spinner needed
export default async function HabitsPage() {
  const habits = await getHabits(); // Direct DB call
  return <HabitList habits={habits} />;
}
```

#### Optimize images
```typescript
import Image from 'next/image';

// ✅ Automatic optimization
<Image src="/hero.png" alt="Hero" width={800} height={600} />
```

### 3. Accessibility

#### Use semantic HTML
```typescript
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<button onClick={handleClick}>Click me</button>
```

#### Add ARIA labels
```typescript
<button aria-label="Mark habit as complete">
  <CheckIcon />
</button>
```

### 4. Error Handling

#### Use error boundaries
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
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

#### Handle API errors gracefully
```typescript
try {
  const habits = await getHabits(userId);
} catch (error) {
  if (error instanceof DatabaseError) {
    return { error: 'Database error. Please try again.' };
  }
  throw error; // Re-throw unexpected errors
}
```

---

## Troubleshooting

### Common Issues

#### Database connection fails
```bash
# Check DATABASE_URL in .env.local
echo $DATABASE_URL

# Test connection
pnpm db:push
```

#### TypeScript errors after installing packages
```bash
# Clear cache and rebuild
rm -rf .next
pnpm type-check
```

#### Tests fail with "Cannot find module"
```bash
# Check tsconfig.json paths
# Ensure @/* aliases are configured
```

#### AI API calls fail
```bash
# Check API key
echo $ANTHROPIC_API_KEY

# Check rate limits
# Anthropic: 50 requests/min (free tier)
```

---

## Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Anthropic Claude API Docs](https://docs.anthropic.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)

---

**Happy coding! 🚀**
