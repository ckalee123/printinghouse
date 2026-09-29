import mongoose from "mongoose";
import { env } from "./env";

export function connectToDatabase() {
    mongoose.connect(env.mongoUri);

    const connection = mongoose.connection;
    connection.once("open", () => {
        console.log(`Connected to MongoDB: ${env.mongoUri}`);
    });
    connection.on("error", (err) => {
        console.error("MongoDB connection error:", err.message);
    });
}
