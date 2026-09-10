import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/portfolio3d";

type MongoCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongo = globalThis as typeof globalThis & {
  mongooseCache?: MongoCache;
};

const cache: MongoCache = globalWithMongo.mongooseCache ?? { conn: null, promise: null };
globalWithMongo.mongooseCache = cache;

export async function connectDB() {
  if (cache.conn && mongoose.connection.readyState === 1) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
        socketTimeoutMS: 20000,
        maxPoolSize: 5,
      })
      .then((connection) => connection)
      .catch((error) => {
        cache.promise = null;
        cache.conn = null;
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
