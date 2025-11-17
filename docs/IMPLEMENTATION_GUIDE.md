# HabitFlow - Step-by-Step Implementation Guide

**Version:** 1.0
**Date:** 2025-11-17
**Purpose:** Detailed instructions for implementing HabitFlow following TDD and best practices

---

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Project Setup](#phase-1-project-setup)
4. [Phase 2: Habit Management (CRUD)](#phase-2-habit-management-crud)
5. [Phase 3: Habit Logging & Streaks](#phase-3-habit-logging--streaks)
6. [Phase 4-5: Auto-Journaling + AI](#phase-4-5-auto-journaling--ai)
7. [Phase 6: Smart Insights](#phase-6-smart-insights)
8. [Phase 7: AI Coach](#phase-7-ai-coach)
9. [Phase 8: Privacy Controls](#phase-8-privacy-controls)
10. [Phase 9: Offline Support](#phase-9-offline-support)
11. [Phase 10: UI Polish](#phase-10-ui-polish)
12. [Phase 11-12: Testing & Launch](#phase-11-12-testing--launch)
13. [Troubleshooting](#troubleshooting)
14. [Resources](#resources)

---

## Overview

This guide walks you through implementing HabitFlow from scratch using **Test-Driven Development (TDD)** and industry best practices. Each phase builds on the previous one, allowing you to deploy and test incrementally.

### Development Philosophy

1. **Test-First**: Write failing tests before implementation
2. **Incremental**: Build and deploy after each phase
3. **User-Centric**: Test features with real users early
4. **Privacy-First**: Anonymization from day one
5. **Quality**: Maintain 80%+ test coverage

### Time Commitment

- **Full-time**: 12 weeks (recommended)
- **Part-time** (20 hrs/week): 24 weeks
- **Minimal MVP** (just Phase 1-3): 4 weeks

---

## Prerequisites

### Required Accounts

1. **GitHub Account**: For version control and CI/CD
2. **Vercel Account**: For deployment and hosting
3. **Anthropic Account**: For Claude API access (get API key)
4. **Clerk Account** (or Auth0/NextAuth): For authentication

### Required Software

```bash
# Check versions
node --version  # Should be v20+
pnpm --version  # Should be v9+
git --version   # Should be v2.30+

# Install if missing
brew install node         # macOS
brew install pnpm
```

### Recommended Tools

- **VSCode** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Error Lens
- **Database GUI**: Drizzle Studio, pgAdmin, or TablePlus
- **API Testing**: Postman or Hoppscotch

---

## Phase 1: Project Setup

**Duration**: 1 week (full-time) or 2 weeks (part-time)
**Goal**: Production-ready Next.js 15 app with auth, database, and testing

### Step 1.1: Initialize Next.js Project

```bash
# Navigate to project directory
cd /Users/nilushansilva/Development/Projects/personal/claude-plugins-learning2

# Create Next.js 15 app
pnpm create next-app@latest . --typescript --tailwind --app --use-pnpm

# Answer prompts:
# ✓ Would you like to use ESLint? → Yes
# ✓ Would you like to use Turbopack? → Yes
# ✓ Would you like to customize the default import alias (@/*)? → Yes (@/)

# Verify setup
pnpm dev
# Visit http://localhost:3000 - should see Next.js welcome page
```

**✅ Checkpoint**: Next.js app runs successfully

---

### Step 1.2: Setup Git Repository

```bash
# Initialize git (if not already done)
git init

# Create .gitignore (Next.js template should include this)
# Add to .gitignore if not present:
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore
echo "node_modules" >> .gitignore

# Initial commit
git add .
git commit -m "chore: initial Next.js 15 setup"

# Create GitHub repo (via GitHub CLI or web interface)
gh repo create habitflow --public --source=. --remote=origin
git push -u origin main
```

**✅ Checkpoint**: Code pushed to GitHub

---

### Step 1.3: Setup Vercel Postgres Database

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Create new project → Import from GitHub → Select `habitflow` repo
3. Go to **Storage** tab → **Create Database** → Select **Postgres**
4. Name: `habitflow-db`
5. Region: Choose closest to your location
6. Click **Create**

7. Copy environment variables:
   - `DATABASE_URL` (for runtime)
   - `POSTGRES_URL_NON_POOLING` (for migrations)

8. Add to local `.env.local`:
```bash
# .env.local
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..." # Use POSTGRES_URL_NON_POOLING value
```

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Link project
vercel link

# Create Postgres database
vercel env pull .env.local
```

**✅ Checkpoint**: Database created and environment variables set

---

### Step 1.4: Setup Drizzle ORM

```bash
# Install dependencies
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit @types/postgres

# Create Drizzle config
touch drizzle.config.ts
```

**File: `drizzle.config.ts`**
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DIRECT_URL!,
  },
} satisfies Config;
```

**File: `src/lib/db/index.ts`**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

export const db = drizzle(client);
```

**File: `src/lib/db/schema.ts`** (Initial - we'll expand this later)
```typescript
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**Add scripts to `package.json`**:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

**Run first migration**:
```bash
pnpm db:generate  # Generate migration files
pnpm db:push      # Apply to database

# Verify with Drizzle Studio
pnpm db:studio    # Opens GUI at http://localhost:4983
```

**✅ Checkpoint**: Database connected, `users` table created

---

### Step 1.5: Setup Clerk Authentication

**Create Clerk Account**:
1. Go to [clerk.com](https://clerk.com)
2. Sign up → Create application → Name: `HabitFlow`
3. Choose authentication methods: Email, Google, GitHub
4. Copy API keys from **API Keys** tab

**Add to `.env.local`**:
```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/habits"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/habits"
```

**Install Clerk**:
```bash
pnpm add @clerk/nextjs
```

**File: `src/middleware.ts`** (Protect routes)
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

**File: `src/app/layout.tsx`** (Add ClerkProvider)
```typescript
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

**Create auth pages**:
```bash
mkdir -p src/app/\(auth\)/sign-in/\[\[...sign-in\]\]
mkdir -p src/app/\(auth\)/sign-up/\[\[...sign-up\]\]
```

**File: `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`**
```typescript
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
```

**File: `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`**
```typescript
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
```

**Test authentication**:
```bash
pnpm dev
# Visit http://localhost:3000/sign-up
# Create account → Should redirect to /habits (which doesn't exist yet - that's okay)
```

**✅ Checkpoint**: User can sign up and sign in

---

### Step 1.6: Setup Testing Infrastructure

**Install testing dependencies**:
```bash
# Vitest (unit tests)
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom

# Playwright (E2E tests)
pnpm add -D @playwright/test
pnpm exec playwright install
```

**File: `vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**File: `vitest.setup.ts`**
```typescript
import '@testing-library/jest-dom';
```

**File: `playwright.config.ts`**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Create test directories**:
```bash
mkdir -p __tests__/unit
mkdir -p __tests__/integration
mkdir -p __tests__/e2e
```

**Write first test** (to verify setup):

**File: `__tests__/unit/example.test.ts`**
```typescript
import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});
```

**Run tests**:
```bash
pnpm test      # Should pass
pnpm test:e2e  # Should run Playwright setup
```

**✅ Checkpoint**: Tests run successfully

---

### Step 1.7: Setup shadcn/ui Components

```bash
# Initialize shadcn/ui
pnpm dlx shadcn-ui@latest init

# Answer prompts:
# ✓ Which style would you like to use? → Default
# ✓ Which color would you like to use as base color? → Slate
# ✓ Would you like to use CSS variables for colors? → Yes

# Install essential components
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add checkbox
pnpm dlx shadcn-ui@latest add dialog
pnpm dlx shadcn-ui@latest add dropdown-menu
pnpm dlx shadcn-ui@latest add form
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add label
pnpm dlx shadcn-ui@latest add select
pnpm dlx shadcn-ui@latest add textarea
pnpm dlx shadcn-ui@latest add toast
```

**Verify components**:
```bash
ls src/components/ui/
# Should see: button.tsx, card.tsx, checkbox.tsx, etc.
```

**✅ Checkpoint**: shadcn/ui components installed

---

### Step 1.8: Setup CI/CD (GitHub Actions + Vercel)

**File: `.github/workflows/ci.yml`**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm tsc --noEmit

      - name: Run unit tests
        run: pnpm test

      - name: Build
        run: pnpm build

  e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
          CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

**Connect GitHub to Vercel**:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import `habitflow` repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
5. Add environment variables (from `.env.local`)
6. Click **Deploy**

**Verify deployment**:
- Visit your Vercel URL (e.g., `habitflow.vercel.app`)
- Should see Next.js app running
- Sign up should work (Clerk connected)

**✅ Checkpoint**: CI/CD pipeline working, app deployed to Vercel

---

### Step 1.9: Create Dashboard Layout

**File: `src/app/(dashboard)/layout.tsx`**
```typescript
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/habits" className="text-xl font-bold">
              HabitFlow
            </Link>
            <nav className="flex gap-4">
              <Link href="/habits" className="text-sm hover:underline">
                Habits
              </Link>
              <Link href="/journal" className="text-sm hover:underline">
                Journal
              </Link>
              <Link href="/insights" className="text-sm hover:underline">
                Insights
              </Link>
              <Link href="/coach" className="text-sm hover:underline">
                Coach
              </Link>
            </nav>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

**File: `src/app/(dashboard)/habits/page.tsx`** (Placeholder)
```typescript
export default function HabitsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">My Habits</h1>
      <p className="mt-2 text-muted-foreground">Coming soon...</p>
    </div>
  );
}
```

**Create other placeholder pages**:
```bash
mkdir -p src/app/\(dashboard\)/journal
mkdir -p src/app/\(dashboard\)/insights
mkdir -p src/app/\(dashboard\)/coach

echo 'export default function JournalPage() { return <div><h1>Journal</h1></div>; }' > src/app/\(dashboard\)/journal/page.tsx
echo 'export default function InsightsPage() { return <div><h1>Insights</h1></div>; }' > src/app/\(dashboard\)/insights/page.tsx
echo 'export default function CoachPage() { return <div><h1>AI Coach</h1></div>; }' > src/app/\(dashboard\)/coach/page.tsx
```

**Test navigation**:
```bash
pnpm dev
# Sign in → Should see dashboard with navigation
```

**✅ Checkpoint**: Dashboard layout complete

---

### Phase 1 Complete! ✅

**What you've built**:
- ✅ Next.js 15 app with TypeScript
- ✅ Vercel Postgres database with Drizzle ORM
- ✅ Clerk authentication (sign-up, sign-in)
- ✅ Testing infrastructure (Vitest + Playwright)
- ✅ shadcn/ui components
- ✅ CI/CD pipeline (GitHub Actions + Vercel)
- ✅ Dashboard layout

**Commit and deploy**:
```bash
git add .
git commit -m "feat: complete Phase 1 - project setup"
git push
# Wait for CI to pass, then check Vercel deployment
```

**Next**: Phase 2 - Habit Management (CRUD)

---

## Phase 2: Habit Management (CRUD)

**Duration**: 1 week
**Goal**: Users can create, read, update, and delete habits

### Step 2.1: Expand Database Schema

**File: `src/lib/db/schema.ts`** (Add habits table)
```typescript
import { pgTable, uuid, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

// ... existing users table ...

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(), // 'health' | 'work' | 'learning' | 'social' | 'other'
  frequency: jsonb('frequency').notNull(), // { type: 'daily' } or { type: 'weekly', days: [...] }
  createdAt: timestamp('created_at').defaultNow(),
  archivedAt: timestamp('archived_at'),
  sortOrder: integer('sort_order').default(0),
});
```

**Generate and apply migration**:
```bash
pnpm db:generate
pnpm db:push
```

**✅ Checkpoint**: `habits` table created in database

---

### Step 2.2: Create Types

**File: `src/types/habit.ts`**
```typescript
import { z } from 'zod';

// Habit categories
export const HABIT_CATEGORIES = ['health', 'work', 'learning', 'social', 'other'] as const;
export type HabitCategory = typeof HABIT_CATEGORIES[number];

// Frequency types
export const FrequencySchema = z.union([
  z.object({ type: z.literal('daily') }),
  z.object({
    type: z.literal('weekly'),
    days: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])),
  }),
  z.object({ type: z.literal('custom'), description: z.string() }),
]);

export type Frequency = z.infer<typeof FrequencySchema>;

// Habit type (from database)
export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: Frequency;
  createdAt: Date;
  archivedAt?: Date;
  sortOrder: number;
}

// Habit creation input
export const CreateHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  category: z.enum(HABIT_CATEGORIES),
  frequency: FrequencySchema,
});

export type CreateHabitInput = z.infer<typeof CreateHabitSchema>;

// Habit update input
export const UpdateHabitSchema = CreateHabitSchema.partial();
export type UpdateHabitInput = z.infer<typeof UpdateHabitSchema>;
```

**✅ Checkpoint**: Types defined

---

### Step 2.3: Create Habit Service (TDD)

**IMPORTANT**: Follow TDD - Write tests FIRST, then implement!

**File: `__tests__/unit/services/habit-service.test.ts`**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createHabit, getHabits, getHabit, updateHabit, archiveHabit } from '@/lib/services/habit-service';
import { db } from '@/lib/db';

// Mock database
vi.mock('@/lib/db');

describe('HabitService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createHabit', () => {
    it('should create habit with valid data', async () => {
      const input = {
        name: 'Morning run',
        category: 'health' as const,
        frequency: { type: 'daily' as const },
      };

      const mockHabit = { id: 'habit-123', userId: 'user-123', ...input, createdAt: new Date() };
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockHabit]),
        }),
      } as any);

      const habit = await createHabit('user-123', input);

      expect(habit.name).toBe('Morning run');
      expect(habit.category).toBe('health');
    });

    it('should reject invalid category', async () => {
      const input = {
        name: 'Test',
        category: 'invalid' as any,
        frequency: { type: 'daily' as const },
      };

      await expect(createHabit('user-123', input)).rejects.toThrow();
    });
  });

  describe('getHabits', () => {
    it('should return only active habits', async () => {
      const mockHabits = [
        { id: '1', name: 'Habit 1', archivedAt: null },
        { id: '2', name: 'Habit 2', archivedAt: null },
      ];

      vi.mocked(db.query).mockReturnValue({
        habits: {
          findMany: vi.fn().mockResolvedValue(mockHabits),
        },
      } as any);

      const habits = await getHabits('user-123');

      expect(habits).toHaveLength(2);
    });
  });

  // Add more tests for update, archive, etc.
});
```

**Run tests** (should FAIL):
```bash
pnpm test
# ❌ FAIL: createHabit is not defined
```

**Now implement the service**:

**File: `src/lib/services/habit-service.ts`**
```typescript
import { db } from '@/lib/db';
import { habits } from '@/lib/db/schema';
import { CreateHabitInput, CreateHabitSchema, UpdateHabitInput, Habit } from '@/types/habit';
import { eq, and, isNull } from 'drizzle-orm';

export async function createHabit(userId: string, input: CreateHabitInput): Promise<Habit> {
  // Validate input
  const validated = CreateHabitSchema.parse(input);

  // Check for duplicate names (active habits only)
  const existing = await db.query.habits.findFirst({
    where: and(eq(habits.userId, userId), eq(habits.name, validated.name), isNull(habits.archivedAt)),
  });

  if (existing) {
    throw new Error('A habit with this name already exists');
  }

  // Create habit
  const [habit] = await db
    .insert(habits)
    .values({
      userId,
      ...validated,
    })
    .returning();

  return habit as Habit;
}

export async function getHabits(userId: string): Promise<Habit[]> {
  return (await db.query.habits.findMany({
    where: and(eq(habits.userId, userId), isNull(habits.archivedAt)),
    orderBy: (habits, { asc }) => [asc(habits.sortOrder), asc(habits.createdAt)],
  })) as Habit[];
}

export async function getHabit(habitId: string, userId: string): Promise<Habit | null> {
  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
  });

  return habit as Habit | null;
}

export async function updateHabit(
  habitId: string,
  userId: string,
  input: UpdateHabitInput
): Promise<Habit> {
  const [updated] = await db
    .update(habits)
    .set(input)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error('Habit not found');
  }

  return updated as Habit;
}

export async function archiveHabit(habitId: string, userId: string): Promise<void> {
  await db
    .update(habits)
    .set({ archivedAt: new Date() })
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
}
```

**Run tests again** (should PASS):
```bash
pnpm test
# ✅ PASS
```

**✅ Checkpoint**: Habit service implemented with tests passing

---

### Step 2.4: Create API Routes (TDD)

**File: `__tests__/integration/api/habits.test.ts`** (using Playwright)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Habits API', () => {
  test('POST /api/habits - should create habit', async ({ request }) => {
    const response = await request.post('/api/habits', {
      data: {
        name: 'Test Habit',
        category: 'health',
        frequency: { type: 'daily' },
      },
      headers: {
        // Add auth token (you'll need to handle Clerk auth in tests)
        Authorization: 'Bearer test-token',
      },
    });

    expect(response.status()).toBe(201);
    const habit = await response.json();
    expect(habit.name).toBe('Test Habit');
  });

  test('GET /api/habits - should return habits', async ({ request }) => {
    const response = await request.get('/api/habits', {
      headers: { Authorization: 'Bearer test-token' },
    });

    expect(response.status()).toBe(200);
    const habits = await response.json();
    expect(Array.isArray(habits)).toBe(true);
  });
});
```

**Implement API routes**:

**File: `src/app/api/habits/route.ts`**
```typescript
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createHabit, getHabits } from '@/lib/services/habit-service';
import { CreateHabitSchema } from '@/types/habit';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const habits = await getHabits(userId);
    return NextResponse.json(habits);
  } catch (error) {
    console.error('GET /api/habits error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = CreateHabitSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const habit = await createHabit(userId, result.data);
    return NextResponse.json(habit, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/habits error:', error);

    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**File: `src/app/api/habits/[id]/route.ts`**
```typescript
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getHabit, updateHabit, archiveHabit } from '@/lib/services/habit-service';
import { UpdateHabitSchema } from '@/types/habit';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const habit = await getHabit(params.id, userId);

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error('GET /api/habits/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = UpdateHabitSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const habit = await updateHabit(params.id, userId, result.data);
    return NextResponse.json(habit);
  } catch (error) {
    console.error('PATCH /api/habits/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await archiveHabit(params.id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/habits/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Test API routes**:
```bash
# Start dev server
pnpm dev

# Use curl or Postman to test (need valid Clerk token)
# Or run Playwright integration tests
pnpm test:e2e
```

**✅ Checkpoint**: API routes implemented and tested

---

### Step 2.5: Create React Components (TDD)

Due to length constraints, I'll provide the file paths and a summary. Refer to the implementation blueprint for full code.

**Components to create**:

1. **`src/components/habits/habit-form.tsx`** - Form for creating/editing habits
2. **`src/components/habits/habit-card.tsx`** - Display single habit
3. **`src/components/habits/habit-list.tsx`** - List all habits
4. **`src/hooks/use-habits.ts`** - TanStack Query hook for habits

**Install TanStack Query**:
```bash
pnpm add @tanstack/react-query
```

**Setup Query Provider** in `src/app/layout.tsx`:
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <html>
          <body>{children}</body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
```

**Implement habit form, list, and pages** following TDD (write tests first).

**✅ Checkpoint**: Users can create, view, edit, and delete habits in UI

---

### Phase 2 Complete! ✅

**Commit and deploy**:
```bash
git add .
git commit -m "feat: complete Phase 2 - habit management CRUD"
git push
```

**Test in production**: Create a habit on your Vercel deployment!

---

## Phase 3-12: Continued Implementation

Due to space constraints, I've provided detailed instructions for **Phase 1 (Setup)** and **Phase 2 (Habit CRUD)**. The remaining phases follow the same pattern:

### Pattern for Each Phase:
1. **Write failing tests first** (TDD: RED)
2. **Implement minimal code to pass** (TDD: GREEN)
3. **Refactor for quality** (TDD: REFACTOR)
4. **Commit and deploy** after each phase
5. **Test with real users** to gather feedback

### Phase Checklist

For each remaining phase, follow these steps:

**Phase 3: Habit Logging & Streaks**
- [ ] Write streak calculation tests
- [ ] Implement streak logic
- [ ] Create habit log table in database
- [ ] Build logging API routes
- [ ] Create habit checkbox component
- [ ] Add heatmap visualization
- [ ] Deploy and test

**Phase 4-5: Auto-Journaling + AI**
- [ ] Write anonymization tests (100% coverage required!)
- [ ] Implement PII removal
- [ ] Setup Claude API integration
- [ ] Create journal editor component
- [ ] Build AI extraction API
- [ ] Test privacy controls
- [ ] Deploy and verify no PII in logs

**Phase 6: Smart Insights**
- [ ] Write analytics utils tests
- [ ] Implement trend analysis
- [ ] Create insight generation service
- [ ] Build insights UI
- [ ] Setup weekly cron job
- [ ] Deploy

**Phase 7: AI Coach**
- [ ] Write coach service tests
- [ ] Implement chat interface
- [ ] Build streaming API
- [ ] Test personalization
- [ ] Deploy

**Phase 8: Privacy Controls**
- [ ] Write settings tests
- [ ] Implement data export
- [ ] Build privacy UI
- [ ] Test GDPR compliance
- [ ] Deploy

**Phase 9: Offline Support**
- [ ] Write IndexedDB tests
- [ ] Implement sync queue
- [ ] Test offline → online sync
- [ ] Handle conflicts
- [ ] Deploy

**Phase 10: UI Polish**
- [ ] Implement keyboard shortcuts
- [ ] Add dark mode
- [ ] Test accessibility (WCAG 2.1 AA)
- [ ] Optimize performance
- [ ] Deploy

**Phase 11-12: Testing & Launch**
- [ ] Write comprehensive E2E tests
- [ ] Fix all critical bugs
- [ ] Security audit
- [ ] Performance testing (Lighthouse > 90)
- [ ] Write user documentation
- [ ] **LAUNCH!** 🚀

---

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
pnpm db:studio
```

#### Clerk Authentication Not Working
```bash
# Verify environment variables
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY

# Check middleware.ts is configured correctly
```

#### Tests Failing After npm Install
```bash
# Clear cache
rm -rf .next node_modules
pnpm install
pnpm test
```

#### Build Errors on Vercel
- Check environment variables are set in Vercel dashboard
- Ensure all dependencies are in `package.json` (not devDependencies if used in build)
- Check build logs for specific errors

---

## Resources

### Official Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Clerk Auth](https://clerk.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Anthropic Claude API](https://docs.anthropic.com)
- [TanStack Query](https://tanstack.com/query/latest)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

### Helpful Guides
- [TDD Best Practices](https://kentcdodds.com/blog/test-driven-development)
- [Privacy-Preserving ML](https://arxiv.org/abs/1811.04017)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Getting Help

If you get stuck:

1. **Check the documentation** (PRD.md, ARCHITECTURE.md, DEVELOPMENT_GUIDE.md)
2. **Search GitHub Issues** for similar problems
3. **Ask Claude** - I can help debug specific issues
4. **Community**: Join Next.js Discord, Clerk Discord for framework-specific questions

---

**Remember**: The key to success is **incremental progress**. Complete each phase fully before moving to the next. Deploy often. Test with real users. Iterate based on feedback.

**Good luck building HabitFlow! 🚀**
