import { pgTable, uuid, text, timestamp, boolean, date, integer, jsonb, index } from "drizzle-orm/pg-core";

/**
 * Users table
 * Stores user account information (managed by authentication provider)
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").unique().notNull(), // External auth ID
  email: text("email").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  settings: jsonb("settings").default({}).notNull(), // Privacy settings, coach preferences
});

/**
 * Habits table
 * Stores user-defined habits with category and frequency
 */
export const habits = pgTable(
  "habits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category").notNull(), // 'health' | 'work' | 'learning' | 'social' | 'other'
    frequency: jsonb("frequency").notNull(), // {"type": "daily"} or {"type": "weekly", "days": ["Mon", "Wed"]}
    createdAt: timestamp("created_at").defaultNow().notNull(),
    archivedAt: timestamp("archived_at"),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_habits_user_id").on(table.userId),
  })
);

/**
 * Habit logs table
 * Tracks daily completion status for each habit
 */
export const habitLogs = pgTable(
  "habit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    habitId: uuid("habit_id")
      .references(() => habits.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    completed: boolean("completed").default(false).notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    habitDateIdx: index("idx_habit_logs_habit_date").on(table.habitId, table.date),
  })
);

/**
 * Journal entries table
 * Stores daily reflections with AI-extracted metadata
 */
export const journalEntries = pgTable(
  "journal_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    content: text("content").notNull(),
    extractedData: jsonb("extracted_data"), // AI-extracted metadata
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userDateIdx: index("idx_journal_user_date").on(table.userId, table.date),
  })
);

/**
 * Insights table
 * Stores AI-generated insights (weekly, monthly, predictive)
 */
export const insights = pgTable(
  "insights",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    type: text("type").notNull(), // 'weekly' | 'monthly' | 'predictive'
    generatedAt: timestamp("generated_at").defaultNow().notNull(),
    data: jsonb("data").notNull(), // Trends, correlations, recommendations
    viewedAt: timestamp("viewed_at"),
  },
  (table) => ({
    userTypeIdx: index("idx_insights_user_type").on(table.userId, table.type, table.generatedAt),
  })
);

/**
 * AI coach messages table
 * Stores conversation history with the AI coach
 */
export const coachMessages = pgTable("coach_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});
