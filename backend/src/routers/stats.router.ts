import express from "express";
import { StatsController } from "../controllers/stats.controller";
import { authRequired, requireRole } from "../middleware/auth.middleware";

const statsRouter = express.Router();
const controller = new StatsController();

statsRouter.use(authRequired, requireRole("admin"));

statsRouter.route("/revenue-by-printer").get(controller.revenueByPrinter);
statsRouter.route("/most-ordered-products").get(controller.mostOrderedProducts);
statsRouter.route("/product-rating-over-time").get(controller.productRatingOverTime);

export default statsRouter;
