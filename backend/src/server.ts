import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import { connectToDatabase } from "./config/db";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";
import healthRouter from "./routers/health.router";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";
import categoryRouter from "./routers/category.router";
import productRouter from "./routers/product.router";
import orderRouter from "./routers/order.router";
import procurementRouter from "./routers/procurement.router";
import commentRouter from "./routers/comment.router";
import adminRouter from "./routers/admin.router";
import statsRouter from "./routers/stats.router";

const app = express();
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

connectToDatabase();

const api = express.Router();
api.use("/health", healthRouter);
api.use("/auth", authRouter);
api.use("/users", userRouter);
api.use("/categories", categoryRouter);
api.use("/products", productRouter);
api.use("/orders", orderRouter);
api.use("/procurements", procurementRouter);
api.use("/comments", commentRouter);
api.use("/admin", adminRouter);
api.use("/stats", statsRouter);
app.use("/api", api);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(env.port, () => console.log(`Express running on port ${env.port}`));
