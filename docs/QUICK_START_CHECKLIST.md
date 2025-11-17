# HabitFlow - Quick Start Checklist

**Purpose**: One-page reference for getting started with HabitFlow implementation

---

## Prerequisites Setup

### Accounts (Create these first)
- [ ] GitHub account (free)
- [ ] Vercel account (free tier)
- [ ] Clerk account (free tier) - [clerk.com](https://clerk.com)
- [ ] Anthropic account + API key - [console.anthropic.com](https://console.anthropic.com)

### Local Software
```bash
# Verify installations
node --version    # Need v20+
pnpm --version    # Need v9+
git --version     # Need v2.30+
```

---

## Phase 1: Project Setup (Week 1)

### 1.1 Initialize Project
```bash
cd /Users/nilushansilva/Development/Projects/personal/claude-plugins-learning2
pnpm create next-app@latest . --typescript --tailwind --app --use-pnpm
pnpm dev  # Verify runs at http://localhost:3000
```

### 1.2 Git & GitHub
```bash
git init
git add .
git commit -m "chore: initial setup"
gh repo create habitflow --public --source=. --remote=origin
git push -u origin main
```

### 1.3 Database (Vercel Postgres)
- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Create new project → Import `habitflow` repo
- [ ] Storage tab → Create Postgres database
- [ ] Copy `DATABASE_URL` and `POSTGRES_URL_NON_POOLING` to `.env.local`

### 1.4 Drizzle ORM
```bash
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit @types/postgres
# Create drizzle.config.ts, src/lib/db/index.ts, src/lib/db/schema.ts
pnpm db:push  # Apply schema to database
```

### 1.5 Authentication (Clerk)
```bash
pnpm add @clerk/nextjs
# Create Clerk app at clerk.com
# Add keys to .env.local:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...
# Create src/middleware.ts, auth pages
pnpm dev  # Test sign-up/sign-in
```

### 1.6 Testing
```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
pnpm add -D @playwright/test
pnpm exec playwright install
# Create vitest.config.ts, playwright.config.ts
pnpm test  # Should pass example test
```

### 1.7 UI Components
```bash
pnpm dlx shadcn-ui@latest init
pnpm dlx shadcn-ui@latest add button card checkbox dialog form input label select textarea toast
```

### 1.8 CI/CD
- [ ] Create `.github/workflows/ci.yml`
- [ ] Push to GitHub → verify Actions run
- [ ] Check Vercel deployment at your-app.vercel.app

### 1.9 Dashboard Layout
- [ ] Create `src/app/(dashboard)/layout.tsx`
- [ ] Create placeholder pages: habits, journal, insights, coach
- [ ] Test navigation works

**Phase 1 Complete!** ✅ Commit and deploy.

---

## Phase 2: Habit CRUD (Week 2)

### 2.1 Database Schema
```bash
# Add habits table to src/lib/db/schema.ts
pnpm db:generate
pnpm db:push
```

### 2.2 Types
- [ ] Create `src/types/habit.ts` with Zod schemas

### 2.3 Habit Service (TDD!)
```bash
# FIRST: Write tests in __tests__/unit/services/habit-service.test.ts
pnpm test  # Should FAIL ❌
# THEN: Implement src/lib/services/habit-service.ts
pnpm test  # Should PASS ✅
```

### 2.4 API Routes
- [ ] Create `src/app/api/habits/route.ts` (GET, POST)
- [ ] Create `src/app/api/habits/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] Test with curl or Postman

### 2.5 React Components
```bash
pnpm add @tanstack/react-query
# Create:
# - src/hooks/use-habits.ts
# - src/components/habits/habit-form.tsx
# - src/components/habits/habit-card.tsx
# - src/components/habits/habit-list.tsx
# - src/app/(dashboard)/habits/page.tsx
# - src/app/(dashboard)/habits/new/page.tsx
```

### 2.6 Test in Browser
```bash
pnpm dev
# Go to /habits → Create a habit → Edit → Delete
```

**Phase 2 Complete!** ✅ Commit and deploy.

---

## Phase 3-10: Remaining Features

### Quick Checklist for Each Phase

**For EVERY phase**:
1. [ ] Write tests FIRST (TDD: Red)
2. [ ] Implement code (TDD: Green)
3. [ ] Refactor (TDD: Refactor)
4. [ ] Commit with conventional commit message
5. [ ] Push to GitHub → CI passes → Vercel deploys
6. [ ] Test on production

**Phase 3: Habit Logging** (Week 3)
- [ ] Streak calculation utils + tests
- [ ] Habit logs table in DB
- [ ] Logging API routes
- [ ] Checkbox component
- [ ] Heatmap component

**Phase 4-5: Auto-Journaling** (Week 4-5)
- [ ] Anonymization layer + tests (100% coverage!)
- [ ] Claude API integration
- [ ] Journal table in DB
- [ ] Journal editor component
- [ ] AI extraction API

**Phase 6: Smart Insights** (Week 6)
- [ ] Analytics utils + tests
- [ ] Insight generation service
- [ ] Insights table in DB
- [ ] Insights UI (charts)
- [ ] Weekly cron job

**Phase 7: AI Coach** (Week 7)
- [ ] Coach service + tests
- [ ] Chat interface component
- [ ] Coach API routes
- [ ] Message storage in DB

**Phase 8: Privacy Controls** (Week 8)
- [ ] Privacy settings UI
- [ ] Data export functionality
- [ ] Data deletion API

**Phase 9: Offline Support** (Week 9)
- [ ] IndexedDB setup (Dexie.js)
- [ ] Sync queue + tests
- [ ] Background sync service

**Phase 10: UI Polish** (Week 10)
- [ ] Keyboard shortcuts
- [ ] Dark mode
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance optimization (Lighthouse > 90)

**Phase 11-12: Launch** (Week 11-12)
- [ ] Comprehensive E2E tests
- [ ] Security audit
- [ ] Bug fixes
- [ ] User documentation
- [ ] Production deployment
- [ ] **LAUNCH!** 🚀

---

## Environment Variables Reference

**File: `.env.local`**
```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For migrations

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/habits"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/habits"

# AI Services (add in Phase 4)
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..." # For embeddings

# Security (add in Phase 4)
ANONYMIZATION_SECRET_KEY="..." # Generate: openssl rand -hex 32

# Optional
REDIS_URL="redis://localhost:6379" # Phase 6+
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Vercel Setup**:
- [ ] Add all env vars in Vercel dashboard → Settings → Environment Variables
- [ ] Redeploy after adding variables

---

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Run production build locally

# Database
pnpm db:generate      # Generate migration files
pnpm db:push          # Apply schema to database
pnpm db:studio        # Open Drizzle Studio GUI

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm lint             # Run linter
pnpm type-check       # TypeScript type checking

# Deployment
git add .
git commit -m "feat: description"
git push              # Auto-deploys to Vercel
```

---

## Documentation Files

**Read these in order**:
1. `PRD.md` - What we're building and why
2. `ARCHITECTURE.md` - How it's built (tech stack, data flow)
3. `DEVELOPMENT_GUIDE.md` - Coding standards and best practices
4. `IMPLEMENTATION_GUIDE.md` - Detailed step-by-step instructions (THIS FILE)
5. `QUICK_START_CHECKLIST.md` - One-page reference

---

## Success Criteria

### After Phase 1:
- [ ] App deploys to Vercel
- [ ] User can sign up/sign in
- [ ] Dashboard navigation works
- [ ] CI/CD pipeline passes

### After Phase 2:
- [ ] User can create habits
- [ ] User can view habits list
- [ ] User can edit habits
- [ ] User can delete habits
- [ ] All tests pass

### After Phase 10 (MVP Complete):
- [ ] All core features working
- [ ] Test coverage > 80%
- [ ] Lighthouse score > 90
- [ ] WCAG 2.1 AA compliant
- [ ] Security audit passed
- [ ] Privacy controls functional
- [ ] Production-ready

---

## Troubleshooting

### Build fails on Vercel
- Check environment variables are set correctly
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### Database connection errors
```bash
echo $DATABASE_URL  # Verify not empty
pnpm db:studio      # Test connection
```

### Tests failing
```bash
rm -rf .next node_modules
pnpm install
pnpm test
```

### Auth not working
- Check Clerk environment variables
- Verify middleware.ts is configured
- Check Clerk dashboard for errors

---

## Need Help?

1. **Read the docs**: Start with PRD.md, then ARCHITECTURE.md
2. **Check implementation guide**: IMPLEMENTATION_GUIDE.md has detailed steps
3. **Search issues**: GitHub repo issues tab
4. **Ask Claude**: I can help debug specific problems!

---

## Remember

- **TDD is mandatory**: Write tests first, always
- **Deploy often**: After each phase
- **Test with users**: Get feedback early
- **Keep it simple**: Don't over-engineer
- **Privacy first**: Test anonymization thoroughly

**Good luck! You've got this! 🚀**
