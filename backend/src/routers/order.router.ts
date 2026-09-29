import express from "express";
import { OrderController } from "../controllers/order.controller";
import { authRequired, requireRole } from "../middleware/auth.middleware";

const orderRouter = express.Router();
const controller = new OrderController();

orderRouter.route("/checkout").post(authRequired, requireRole("client"), controller.checkout);
orderRouter.route("/mine").get(authRequired, requireRole("client"), controller.listMine);
orderRouter.route("/archive").get(authRequired, requireRole("client"), controller.archive);
orderRouter.route("/for-printer").get(authRequired, requireRole("printer"), controller.listForPrinter);

orderRouter.route("/:id/cancel").post(authRequired, requireRole("client"), controller.cancel);
orderRouter.route("/:id/receive").post(authRequired, requireRole("client"), controller.markReceived);
orderRouter.route("/:id/status").patch(authRequired, requireRole("printer"), controller.updateStatus);

export default orderRouter;
