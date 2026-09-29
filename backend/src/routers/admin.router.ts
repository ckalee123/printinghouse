import express from "express";
import { AdminController } from "../controllers/admin.controller";
import { authRequired, requireRole } from "../middleware/auth.middleware";

const adminRouter = express.Router();
const controller = new AdminController();

adminRouter.use(authRequired, requireRole("admin"));

adminRouter.route("/users").get(controller.listUsers);
adminRouter.route("/users/:id").put(controller.updateUser);
adminRouter.route("/users/:id").delete(controller.deleteUser);
adminRouter.route("/pending").get(controller.listPending);
adminRouter.route("/users/:id/approve").post(controller.approve);
adminRouter.route("/users/:id/reject").post(controller.reject);

export default adminRouter;
