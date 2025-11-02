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

  // Limits (según plan - defaults para FREE plan)
  responsesLimit: integer('responses_limit').notNull().default(0), // FREE: 0 WhatsApp responses
  responsesUsedThisMonth: integer('responses_used_this_month').notNull().default(0),
  surveysLimit: integer('surveys_limit').notNull().default(1), // FREE: 1 survey
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

  // Customization (branding)
  brandColor: varchar('brand_color', { length: 7 }).default('#2563eb'), // Primary color (hex)
  accentColor: varchar('accent_color', { length: 7 }).default('#06b6d4'), // Accent color (hex)
  logoUrl: text('logo_url'), // URL to custom logo
  customStyles: jsonb('custom_styles'), // Additional custom styles

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
  views: many(surveyViews),
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

// AI Generations - Tracking de uso de features AI
export const aiGenerations = pgTable('ai_generations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),

  // Tipo de generación
  generationType: varchar('generation_type', { length: 50 }).notNull(), // 'survey_generator' | 'ai_analysis'

  // Data de la generación
  prompt: text('prompt').notNull(),
  response: jsonb('response').notNull(),

  // Métricas
  tokensUsedInput: integer('tokens_used_input').notNull(),
  tokensUsedOutput: integer('tokens_used_output').notNull(),
  costUsd: integer('cost_usd').notNull(), // Almacenar en microdólares (0.0003 USD = 300)
  latencyMs: integer('latency_ms'),

  // Metadata
  model: varchar('model', { length: 50 }).notNull().default('gpt-4o-mini'),
  success: boolean('success').notNull().default(true),
  errorMessage: text('error_message'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('ai_gen_tenant_date_idx').on(table.tenantId, table.createdAt),
  index('ai_gen_tenant_type_idx').on(table.tenantId, table.generationType),
  index('ai_gen_created_idx').on(table.createdAt),
]);

export const aiGenerationsRelations = relations(aiGenerations, ({ one }) => ({
  tenant: one(tenants, {
    fields: [aiGenerations.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [aiGenerations.userId],
    references: [users.id],
  }),
}));

// Survey Views - Tracking de vistas únicas
export const surveyViews = pgTable('survey_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  surveyId: uuid('survey_id').notNull().references(() => surveys.id, { onDelete: 'cascade' }),

  // Identificadores para deduplicación
  ipAddress: varchar('ip_address', { length: 45 }), // IPv4 o IPv6
  userAgent: text('user_agent'),
  fingerprint: varchar('fingerprint', { length: 64 }), // Hash del user agent + otros datos

  // Metadata
  referrer: text('referrer'),
  isBot: boolean('is_bot').notNull().default(false),

  // Timestamps
  viewedAt: timestamp('viewed_at').notNull().defaultNow(),
}, (table) => [
  index('survey_views_survey_idx').on(table.surveyId),
  index('survey_views_survey_ip_idx').on(table.surveyId, table.ipAddress),
  index('survey_views_fingerprint_idx').on(table.fingerprint),
  index('survey_views_viewed_at_idx').on(table.viewedAt),
]);

export const surveyViewsRelations = relations(surveyViews, ({ one }) => ({
  survey: one(surveys, {
    fields: [surveyViews.surveyId],
    references: [surveys.id],
  }),
}));

// Support Tickets
export const supportTickets = pgTable('support_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),

  // Ticket info
  ticketNumber: varchar('ticket_number', { length: 20 }).notNull().unique(),
  subject: varchar('subject', { length: 200 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // technical, billing, feature, account, api, other
  priority: varchar('priority', { length: 20 }).notNull(), // low, normal, high
  status: varchar('status', { length: 50 }).notNull().default('open'), // open, in_progress, resolved, closed
  message: text('message').notNull(),

  // User info (denormalized for easier access)
  userEmail: varchar('user_email', { length: 255 }).notNull(),
  userName: varchar('user_name', { length: 255 }),

  // Resolution
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: uuid('resolved_by').references(() => users.id, { onDelete: 'set null' }),
  resolutionNotes: text('resolution_notes'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('support_tickets_tenant_idx').on(table.tenantId),
  index('support_tickets_user_idx').on(table.userId),
  index('support_tickets_status_idx').on(table.status),
  index('support_tickets_created_idx').on(table.createdAt),
  index('support_tickets_number_idx').on(table.ticketNumber),
]);

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  tenant: one(tenants, {
    fields: [supportTickets.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  resolver: one(users, {
    fields: [supportTickets.resolvedBy],
    references: [users.id],
  }),
}));
