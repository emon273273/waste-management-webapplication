export default {
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "utils/db/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: process.env.DATABASE_URL,
    connectionString: process.env.DATABASE_URL,
  },
};
