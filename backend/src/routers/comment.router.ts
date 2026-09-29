import express from "express";
import { CommentController } from "../controllers/comment.controller";
import { authRequired, requireRole } from "../middleware/auth.middleware";

const commentRouter = express.Router();
const controller = new CommentController();

commentRouter.route("/product/:productId").get(controller.listForProduct);
commentRouter.route("/").post(authRequired, requireRole("client"), controller.create);

export default commentRouter;
