# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HabitFlow is a **minimalist, AI-powered habit tracking web application** currently in the planning phase. This is a greenfield Next.js 15 project that prioritizes:
- **Local-first architecture** with IndexedDB + cloud sync
- **Privacy-preserving AI** through anonymization layers
- **Test-Driven Development (TDD)** - tests must be written before implementation
- **Clean architecture** with separation of concerns

**Status**: Pre-implementation (documentation complete, no code yet)

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.3+, Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix primitives)
- **State Management**: TanStack Query (server state), Zustand/Context (local state)
- **Backend**: Next.js API routes (Option: FastAPI for scale)
- **Database**: PostgreSQL 16 (Vercel Postgres) with pgvector for embeddings
- **ORM**: Drizzle ORM
- **Authentication**: Clerk or NextAuth.js v5
- **AI**: Anthropic Claude API (Opus/Sonnet) for coaching and insights
- **Testing**: Vitest (unit), Playwright (integration/E2E)
- **Local Storage**: IndexedDB via Dexie.js for offline support

## Critical Development Workflow: TDD is Mandatory

**This project requires strict Test-Driven Development**. The development cycle is:

### Red-Green-Refactor Cycle
1. **RED**: Write failing test first
2. **GREEN**: Write minimal code to pass
3. **REFACTOR**: Improve code quality while keeping tests green

### Example TDD Flow
```bash
# 1. Write test (it will fail)
pnpm test  # ❌ FAIL

# 2. Implement feature
# Write code in src/

# 3. Test passes
pnpm test  # ✅ PASS

# 4. Refactor and verify
pnpm lint
pnpm type-check
```

**Never implement features without tests first.**

## Common Commands

### Development
```bash
pnpm dev              # Start dev server at http://localhost:3000
pnpm build            # Build for production
pnpm start            # Run production build locally
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking
```

### Database
```bash
pnpm db:generate      # Generate Drizzle migration files
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio GUI
pnpm db:seed          # Seed database with test data
```

### Testing (Critical)
```bash
pnpm test             # Run all unit tests (Vitest)
pnpm test:watch       # Run tests in watch mode
pnpm test:e2e         # Run E2E tests (Playwright)
pnpm test:integration # Run integration tests
```

## High-Level Architecture

### Data Flow
1. **Habit Logging**: UI → Local (IndexedDB) → API → PostgreSQL
2. **Journal Entry**: Editor → Save locally → API → Anonymization layer → Claude API → Extract metadata → Store
3. **Insight Generation**: Cron job → Fetch data → Anonymize → Claude API → Parse → Store in DB

### Key Architectural Patterns

#### 1. Anonymization Layer (Privacy-Critical)
**All data sent to external AI services must be anonymized first**:
```typescript
// REQUIRED pattern before any AI API call
const anonData = await anonymizeForAI(userId, data);
const result = await aiProvider.generateInsights(anonData);
```

The anonymization layer (`src/lib/ai/anonymization.ts`):
- Hashes user IDs with HMAC-SHA256
- Strips PII (names, emails, phone numbers) from text
- Aggregates metadata to prevent re-identification

#### 2. AI Service Abstraction
AI providers are swappable via interface:
```typescript
interface AIProvider {
  generateInsights(data: AnonymizedData): Promise<Insight>;
  coachMessage(context: CoachContext): Promise<string>;
  extractJournalData(entry: string): Promise<ExtractedData>;
}
```

Implementations: `ClaudeProvider`, `GPTProvider`, `LocalLLMProvider` (future)

#### 3. Clean Architecture Layers
```
UI Layer (React Components)
    ↓
API Layer (Next.js API Routes)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Database (PostgreSQL)
```

**Never bypass layers** - UI should not call database directly.

## Project Structure (When Implemented)

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard layout group
│   │   ├── habits/        # Habit pages
│   │   ├── journal/       # Journal pages
│   │   ├── insights/      # Insights pages
│   │   └── coach/         # AI coach chat
│   ├── api/               # API routes
│   │   ├── habits/        # Habit CRUD
│   │   ├── journal/       # Journal CRUD + AI extraction
│   │   └── insights/      # Insight generation
│   └── (auth)/            # Auth pages (sign-in, sign-up)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── habits/           # Habit-specific components
│   ├── journal/          # Journal editor
│   └── insights/         # Charts and visualizations
├── lib/
│   ├── db/               # Database client + schema
│   │   ├── index.ts      # Drizzle client
│   │   └── schema.ts     # Database tables
│   ├── services/         # Business logic
│   │   ├── habit-service.ts
│   │   ├── insight-service.ts
│   │   └── coach-service.ts
│   ├── ai/               # AI integration
│   │   ├── anonymization.ts  # PII removal (CRITICAL)
│   │   ├── claude.ts         # Claude provider
│   │   └── providers.ts      # AI provider abstraction
│   └── utils/            # Utilities
├── hooks/                # React hooks (useHabits, useJournal)
├── types/                # TypeScript types + Zod schemas
└── __tests__/            # Tests (mirror src/ structure)
    ├── unit/
    ├── integration/
    └── e2e/
```

## Database Schema (Key Tables)

### Core Tables
- `users` - User accounts (managed by Clerk/NextAuth)
- `habits` - User habits (name, category, frequency)
- `habit_logs` - Daily completion logs (date, completed)
- `journal_entries` - Daily reflections + AI extracted data
- `insights` - AI-generated weekly/monthly insights
- `coach_messages` - AI coach conversation history

### Important Constraints
- `habits`: Unique constraint on `(user_id, name)` where `archived_at IS NULL`
- `habit_logs`: Unique constraint on `(habit_id, date)`
- `journal_entries`: Has `embedding vector(1536)` for semantic search (pgvector)

## Code Standards

### TypeScript
- **Use strict types** - No `any` unless absolutely necessary
- **Zod for validation** - All API inputs validated with Zod schemas
- **Type inference** - Let TypeScript infer when possible

### React Components
- **Server Components by default** (Next.js 15 App Router)
- **Client Components** only when using hooks/interactivity (mark with `'use client'`)
- **Component structure**: Imports → Types → Component → Hooks → Handlers → Render

### API Routes
1. Authenticate with Clerk/NextAuth
2. Validate input with Zod
3. Execute business logic via services
4. Return typed responses

### Privacy Rules (NON-NEGOTIABLE)
- ❌ **Never log sensitive data** (user emails, journal content, raw user IDs)
- ✅ **Always anonymize before AI calls** via `anonymizeForAI()`
- ✅ **Use hashed user IDs** in AI prompts
- ✅ **Strip PII** from journal entries before external API calls

### Git Workflow
- **Branch naming**: `feature/`, `fix/`, `refactor/`, `test/`, `docs/`
- **Commits**: Conventional Commits format (`feat:`, `fix:`, `test:`, `refactor:`)
- **PR process**: All tests must pass, code review required

## Implementation Phases

The project is structured in 12 phases (see `docs/QUICK_START_CHECKLIST.md`):

1. **Phase 1**: Project setup (Next.js, DB, auth, testing)
2. **Phase 2**: Habit CRUD
3. **Phase 3**: Habit logging (streaks, heatmaps)
4. **Phase 4-5**: Auto-journaling + AI extraction
5. **Phase 6**: Smart insights (weekly reports)
6. **Phase 7**: AI coach
7. **Phase 8**: Privacy controls
8. **Phase 9**: Offline support (IndexedDB)
9. **Phase 10**: UI polish
10. **Phase 11-12**: Testing + launch

**Current Phase**: Pre-Phase 1 (setup not started)

## Testing Strategy

### Test Types
1. **Unit Tests** (Vitest): Pure functions, services, utilities
   - Target: 80%+ coverage
   - Fast execution (< 1ms per test)
   - Mock external dependencies

2. **Integration Tests** (Playwright): API routes, database operations
   - Test with test database
   - Cover critical paths

3. **E2E Tests** (Playwright): User flows
   - Happy paths + error cases
   - Run in CI before deploy

### AAA Pattern (Arrange-Act-Assert)
```typescript
it('should calculate streak correctly', () => {
  // Arrange
  const logs = [{ date: '2025-01-03', completed: true }];

  // Act
  const streak = calculateStreak(logs);

  // Assert
  expect(streak).toBe(1);
});
```

## Performance Targets
- Page Load: < 1s (First Contentful Paint)
- Interactivity: < 100ms (Time to Interactive)
- API Response: < 500ms (p95)
- AI Insights: < 5s (generation time)
- Lighthouse Score: > 90

## Important Documentation Files

Read in this order for context:
1. `docs/PRD.md` - Product requirements, features, user personas
2. `docs/ARCHITECTURE.md` - Technical architecture, data flow, tech stack
3. `docs/DEVELOPMENT_GUIDE.md` - Coding standards, TDD examples, best practices
4. `docs/QUICK_START_CHECKLIST.md` - Phase-by-phase implementation checklist
5. `docs/PHASE_3_REFINED_UI_DESIGN.md` - Comprehensive UI/UX design for gamified habit logging (Jan 2025)

## Common Pitfalls to Avoid

1. **Skipping tests** - Tests MUST be written first (TDD)
2. **Bypassing anonymization** - All AI calls must go through anonymization layer
3. **Using Client Components unnecessarily** - Prefer Server Components
4. **Logging sensitive data** - Never log user data, emails, or journal content
5. **Tight coupling to AI provider** - Use AI abstraction layer, not direct API calls
6. **Ignoring privacy settings** - Check user preferences before AI calls

## Environment Variables (Required)

```bash
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...  # For migrations

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# AI Services
ANTHROPIC_API_KEY=sk-ant-...

# Security (for anonymization)
ANONYMIZATION_SECRET_KEY=...  # Generate: openssl rand -hex 32
```

## Key Design Decisions

1. **Local-first**: Data stored in IndexedDB first, synced to cloud
2. **Privacy by design**: Anonymization layer is non-negotiable
3. **Modular AI**: Provider abstraction allows swapping Claude/GPT/Local LLMs
4. **Developer UX**: Keyboard shortcuts, dark mode, fast interactions
5. **No feature bloat**: Minimalist design, essential features only

## When Making Changes

Before implementing any feature:
1. ✅ Read relevant docs (PRD, Architecture)
2. ✅ Write tests first (TDD: Red)
3. ✅ Implement minimal code (TDD: Green)
4. ✅ Refactor (TDD: Refactor)
5. ✅ Check privacy implications (anonymization needed?)
6. ✅ Run all tests: `pnpm test && pnpm lint && pnpm type-check`
7. ✅ Commit with conventional commit message

## Privacy & Security Checklist

Every AI-related feature must:
- [ ] Anonymize user data before API calls
- [ ] Hash user IDs (HMAC-SHA256)
- [ ] Strip PII from text (names, emails, phone numbers)
- [ ] Check user privacy settings
- [ ] Log anonymized data only
- [ ] Handle API failures gracefully
- [ ] Document data flow in code comments
