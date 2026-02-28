import { config } from "dotenv";

import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

async function waitForDatabase(maxAttempts = 50): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await prisma.$executeRawUnsafe("SELECT 1");
      return;
    } catch (error) {
      if (i === maxAttempts - 1) {
        throw new Error("Database did not become ready in time");
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

const schemaId = randomUUID();

async function runMigration(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      execSync("yarn prisma migrate deploy", { stdio: "inherit" });
      return;
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  // Wait for database to be ready before running migrations
  await waitForDatabase();

  await runMigration();
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
