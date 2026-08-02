import "server-only";
import dns from "node:dns";
import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME ?? "quran_website";

declare global {
  var quranMongoClientPromise: Promise<MongoClient> | undefined;
}

async function connect() {
  if (!uri) throw new Error("MONGODB_URI is not configured");

  const createClient = () => new MongoClient(uri, { serverSelectionTimeoutMS: 15_000 }).connect();
  try {
    return await createClient();
  } catch (error) {
    // Some Windows DNS resolvers refuse Atlas SRV lookups even though normal
    // DNS resolution works. Retry through public resolvers only for that case.
    if (uri.startsWith("mongodb+srv://") && error instanceof Error && error.message.includes("querySrv ECONNREFUSED")) {
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
      return createClient();
    }
    throw error;
  }
}

export async function getDatabase(): Promise<Db> {
  global.quranMongoClientPromise ??= connect();
  return (await global.quranMongoClientPromise).db(databaseName);
}
