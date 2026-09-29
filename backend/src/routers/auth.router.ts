import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { uploadImage } from "../middleware/upload.middleware";

const authRouter = express.Router();
const controller = new AuthController();

authRouter.route("/register/client").post(uploadImage.single("profileImage"), controller.registerClient);
authRouter.route("/register/printer").post(uploadImage.single("profileImage"), controller.registerPrinter);
authRouter.route("/login").post(controller.login);
authRouter.route("/admin-login").post(controller.adminLogin);

export default authRouter;
