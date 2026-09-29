import dotenv from "dotenv";
dotenv.config();

export const env = {
    port: parseInt(process.env.PORT || "4000", 10),
    clientUrl: process.env.CLIENT_URL || "http://localhost:4200",
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/printing_house",
    jwtSecret: process.env.JWT_SECRET || "dev_secret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "2h",
    smtp: {
        host: process.env.SMTP_HOST || "",
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
        from: process.env.SMTP_FROM || "Printing House <no-reply@printinghouse.local>"
    }
};
