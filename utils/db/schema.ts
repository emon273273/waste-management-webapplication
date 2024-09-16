import {
  integer,
  varchar,
  serial,
  text,
  pgTable,
  pgSchema,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

//user table
export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//report table
export const Reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => Users.id)
    .notNull(),
  location: text("location").notNull(),
  wasteType: varchar("waste_type", { length: 255 }).notNull(),

  amount: varchar("amount", { length: 255 }).notNull(),
  imageUrl: text("image_url"),
  verificationResult: jsonb("verification_result"),
  status: varchar("status", { length:10 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  collectorId: integer("collector_id").references(() => Users.id),
});

//reward table

export const Rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => Users.id)
    .notNull(),

  points: integer("points").notNull().default(0),
  updateAt: timestamp("updated_at").defaultNow().notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  description: text("description"),
  name: varchar("name", { length: 255 }).notNull(),
  collectionInfo: text("collection_info").notNull(),
});

//collectedwaste table

export const CollectedWaste = pgTable("collecte_waste", {
  id: serial("id").primaryKey(),

  reportID: integer("report_id")
    .references(() => Reports.id)
    .notNull(),
  CollectorId: integer("collector_id")
    .references(() => Users.id)
    .notNull(),

  CollectionDate: timestamp("collection_date").notNull(),
  status: varchar("status", { length: 255 }).notNull().default("collected"),
});

//notification table

export const Notification = pgTable("notification", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => Users.id)
    .notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(), //basically type of notification
  isRead: boolean("is_read").notNull().default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//transaction table

export const Transaction = pgTable("transaction", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => Users.id)
    .notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});
