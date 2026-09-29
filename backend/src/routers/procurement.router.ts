import express from "express";
import { ProcurementController } from "../controllers/procurement.controller";
import { authRequired, requireRole } from "../middleware/auth.middleware";

const procurementRouter = express.Router();
const controller = new ProcurementController();

procurementRouter.route("/").post(authRequired, requireRole("client"), controller.create);
procurementRouter.route("/mine").get(authRequired, requireRole("client"), controller.listMine);
procurementRouter.route("/open").get(authRequired, requireRole("printer"), controller.listOpenForPrinter);
procurementRouter.route("/mine-printer").get(authRequired, requireRole("printer"), controller.listAllForPrinter);
procurementRouter.route("/:id/bid").post(authRequired, requireRole("printer"), controller.submitBid);
procurementRouter.route("/:id/report").get(authRequired, requireRole("printer"), controller.getReportPdf);

export default procurementRouter;
