import express from "express";
import { CategoryController } from "../controllers/category.controller";
import { authRequired, requireRole } from "../middleware/auth.middleware";

const categoryRouter = express.Router();
const controller = new CategoryController();

categoryRouter.route("/").get(controller.list);
categoryRouter.route("/active").get(controller.listWithActiveProducts);
categoryRouter.route("/").post(authRequired, requireRole("admin"), controller.create);
categoryRouter.route("/:id").put(authRequired, requireRole("admin"), controller.update);
categoryRouter.route("/:id").delete(authRequired, requireRole("admin"), controller.remove);
categoryRouter.route("/:id/subcategories").post(authRequired, requireRole("admin"), controller.addSubcategory);
categoryRouter.route("/:id/subcategories/:subId").delete(authRequired, requireRole("admin"), controller.removeSubcategory);

export default categoryRouter;
