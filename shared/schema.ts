import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  topics: jsonb("topics").$type<string[]>().notNull().default([]),
  completedTopics: jsonb("completed_topics").$type<string[]>().notNull().default([]),
  currentTopicIndex: integer("current_topic_index").notNull().default(0),
  progressPercentage: integer("progress_percentage").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const topics = pgTable("topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: jsonb("content").$type<{
    lessons: Array<{
      id: string;
      title: string;
      content: string;
      type: 'article' | 'video' | 'interactive';
      estimatedTime: number;
    }>;
    prerequisites: string[];
    learningObjectives: string[];
  }>().notNull(),
  difficulty: text("difficulty").notNull(),
  estimatedTime: integer("estimated_time").notNull(), // in minutes
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  connections: jsonb("connections").$type<string[]>().notNull().default([]), // connected topic IDs
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  topicId: varchar("topic_id").notNull().references(() => topics.id),
  status: text("status").notNull(), // 'not_started', 'in_progress', 'completed'
  progressPercentage: integer("progress_percentage").notNull().default(0),
  completedLessons: jsonb("completed_lessons").$type<string[]>().notNull().default([]),
  timeSpent: integer("time_spent").notNull().default(0), // in minutes
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  estimatedTime: integer("estimated_time").notNull(),
  technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
  instructions: jsonb("instructions").$type<{
    steps: Array<{
      id: string;
      title: string;
      description: string;
      code?: string;
      hints: string[];
    }>;
  }>().notNull(),
  starterCode: text("starter_code"),
  solutionCode: text("solution_code"),
});

export const userProjects = pgTable("user_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  status: text("status").notNull(), // 'not_started', 'in_progress', 'completed'
  code: text("code"),
  submittedAt: timestamp("submitted_at"),
  score: integer("score"),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  messages: jsonb("messages").$type<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>>().notNull().default([]),
  context: jsonb("context").$type<{
    currentTopic?: string;
    learningPath?: string;
    difficulty?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const researchPapers = pgTable("research_papers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  authors: jsonb("authors").$type<string[]>().notNull(),
  abstract: text("abstract").notNull(),
  url: text("url").notNull(),
  publishedDate: timestamp("published_date"),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  aiSummary: text("ai_summary"),
  trendingScore: integer("trending_score").notNull().default(0),
  readingTime: integer("reading_time").notNull(), // in minutes
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTopicSchema = createInsertSchema(topics).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessedAt: true,
  completedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertUserProjectSchema = createInsertSchema(userProjects).omit({
  id: true,
  submittedAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResearchPaperSchema = createInsertSchema(researchPapers).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;

export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type UserProject = typeof userProjects.$inferSelect;
export type InsertUserProject = z.infer<typeof insertUserProjectSchema>;

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;

export type ResearchPaper = typeof researchPapers.$inferSelect;
export type InsertResearchPaper = z.infer<typeof insertResearchPaperSchema>;
