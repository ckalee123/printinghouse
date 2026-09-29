import express from "express";
import { UserController } from "../controllers/user.controller";
import { authRequired } from "../middleware/auth.middleware";
import { uploadImage } from "../middleware/upload.middleware";

const userRouter = express.Router();
const controller = new UserController();

userRouter.route("/me").get(authRequired, controller.me);
userRouter.route("/me").put(authRequired, uploadImage.single("profileImage"), controller.updateMe);

export default userRouter;
