import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";
import { resolve } from "path";

// Cargar variables de entorno desde .env.local
dotenv.config({ path: resolve(__dirname, ".env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
