import { pgTable, uuid, varchar, text, integer, timestamp, boolean, jsonb, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tenants (clientes de ChatForm)
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),

  // Billing
  plan: varchar('plan', { length: 50 }).notNull().default('free'), // free, starter, pro
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  subscriptionStatus: varchar('subscription_status', { length: 50 }), // active, canceled, past_due

  // API Access
  apiKeyHash: varchar('api_key_hash', { length: 128 }),
  apiKeyPrefix: varchar('api_key_prefix', { length: 32 }),

  // Limits (según plan)
  responsesLimit: integer('responses_limit').notNull().default(50),
  responsesUsedThisMonth: integer('responses_used_this_month').notNull().default(0),
  surveysLimit: integer('surveys_limit').notNull().default(1),
  sendCreditsLimit: integer('send_credits_limit').notNull().default(0), // envíos automáticos
  sendCreditsUsed: integer('send_credits_used').notNull().default(0),

  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('tenants_slug_idx').on(table.slug),
  index('tenants_api_key_prefix_idx').on(table.apiKeyPrefix),
]);

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }), // nullable si usa OAuth
  name: varchar('name', { length: 255 }),

  // OAuth
  googleId: varchar('google_id', { length: 255 }),

  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('users_email_idx').on(table.email),
]);

// User-Tenant relationship (multi-tenant support)
export const tenantUsers = pgTable('tenant_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull().default('owner'), // owner, admin, member

  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  unique('tenant_user_unique').on(table.tenantId, table.userId),
  index('tenant_users_tenant_idx').on(table.tenantId),
  index('tenant_users_user_idx').on(table.userId),
]);

// Surveys
export const surveys = pgTable('surveys', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Content
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  welcomeMessage: text('welcome_message'),
  thankYouMessage: text('thank_you_message'),

  // Settings
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, active, paused, archived
  shortCode: varchar('short_code', { length: 20 }).notNull().unique(),

  // Stats
  viewCount: integer('view_count').notNull().default(0),
  responseCount: integer('response_count').notNull().default(0),

  // Metadata
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('surveys_tenant_idx').on(table.tenantId),
  index('surveys_short_code_idx').on(table.shortCode),
  index('surveys_status_idx').on(table.status),
]);

// Questions
export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  surveyId: uuid('survey_id').notNull().references(() => surveys.id, { onDelete: 'cascade' }),

  // Content
  questionText: text('question_text').notNull(),
  questionType: varchar('question_type', { length: 50 }).notNull(), // multiple_choice, rating, open_text
  options: jsonb('options'), // array de opciones para multiple_choice

  // Order
  orderIndex: integer('order_index').notNull(),

  // Settings
  required: boolean('required').notNull().default(true),

  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('questions_survey_idx').on(table.surveyId),
  index('questions_order_idx').on(table.surveyId, table.orderIndex),
]);

// Survey Sessions (una conversación)
export const surveySessions = pgTable('survey_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  surveyId: uuid('survey_id').notNull().references(() => surveys.id, { onDelete: 'cascade' }),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // User info
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  whatsappName: varchar('whatsapp_name', { length: 255 }), // nombre de WhatsApp del usuario

  // Progress
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, completed, abandoned
  currentQuestionIndex: integer('current_question_index').notNull().default(0),

  // Delivery
  deliveryMethod: varchar('delivery_method', { length: 50 }).notNull().default('link'), // link, automatic, webhook

  // Timestamps
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  lastInteractionAt: timestamp('last_interaction_at').notNull().defaultNow(),
}, (table) => [
  index('sessions_survey_idx').on(table.surveyId),
  index('sessions_tenant_idx').on(table.tenantId),
  index('sessions_phone_idx').on(table.phoneNumber),
  index('sessions_status_idx').on(table.status),
]);

// Responses
export const responses = pgTable('responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => surveySessions.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),

  // Answer (solo uno de estos estará lleno según el tipo)
  answerText: text('answer_text'), // para open_text
  answerOption: varchar('answer_option', { length: 255 }), // para multiple_choice
  answerRating: integer('answer_rating'), // para rating (1-5)

  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('responses_session_idx').on(table.sessionId),
  index('responses_question_idx').on(table.questionId),
]);

// Short Links (para tracking)
export const shortLinks = pgTable('short_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  surveyId: uuid('survey_id').notNull().references(() => surveys.id, { onDelete: 'cascade' }),

  shortCode: varchar('short_code', { length: 20 }).notNull().unique(),
  destinationUrl: text('destination_url').notNull(),

  // Stats
  clicks: integer('clicks').notNull().default(0),

  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('short_links_code_idx').on(table.shortCode),
  index('short_links_survey_idx').on(table.surveyId),
]);

// Relations (para Drizzle Query)
export const tenantsRelations = relations(tenants, ({ many }) => ({
  tenantUsers: many(tenantUsers),
  surveys: many(surveys),
  sessions: many(surveySessions),
}));

export const usersRelations = relations(users, ({ many }) => ({
  tenantUsers: many(tenantUsers),
  surveysCreated: many(surveys),
}));

export const tenantUsersRelations = relations(tenantUsers, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantUsers.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [tenantUsers.userId],
    references: [users.id],
  }),
}));

export const surveysRelations = relations(surveys, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [surveys.tenantId],
    references: [tenants.id],
  }),
  creator: one(users, {
    fields: [surveys.createdBy],
    references: [users.id],
  }),
  questions: many(questions),
  sessions: many(surveySessions),
  shortLinks: many(shortLinks),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  survey: one(surveys, {
    fields: [questions.surveyId],
    references: [surveys.id],
  }),
  responses: many(responses),
}));

export const surveySessionsRelations = relations(surveySessions, ({ one, many }) => ({
  survey: one(surveys, {
    fields: [surveySessions.surveyId],
    references: [surveys.id],
  }),
  tenant: one(tenants, {
    fields: [surveySessions.tenantId],
    references: [tenants.id],
  }),
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  session: one(surveySessions, {
    fields: [responses.sessionId],
    references: [surveySessions.id],
  }),
  question: one(questions, {
    fields: [responses.questionId],
    references: [questions.id],
  }),
}));

export const shortLinksRelations = relations(shortLinks, ({ one }) => ({
  survey: one(surveys, {
    fields: [shortLinks.surveyId],
    references: [surveys.id],
  }),
}));
