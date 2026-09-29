import express from "express";
import { ProductController } from "../controllers/product.controller";
import { authRequired, optionalAuth, requireRole } from "../middleware/auth.middleware";
import { uploadImage, uploadJson } from "../middleware/upload.middleware";

const productRouter = express.Router();
const controller = new ProductController();

const productImages = uploadImage.fields([
    { name: "slika", maxCount: 1 },
    { name: "dodatneSlike", maxCount: 3 }
]);

productRouter.route("/public/stats").get(controller.publicStats);
productRouter.route("/search").get(controller.search);
productRouter.route("/mine").get(authRequired, requireRole("printer"), controller.listMine);
productRouter.route("/import-json").post(authRequired, requireRole("printer"), uploadJson.single("file"), controller.importJson);

productRouter.route("/").post(authRequired, requireRole("printer"), productImages, controller.create);

productRouter.route("/:id").get(optionalAuth, controller.getById);
productRouter.route("/:id").put(authRequired, requireRole("printer"), productImages, controller.update);
productRouter.route("/:id/images").put(authRequired, requireRole("printer"), productImages, controller.setProductImage);
productRouter.route("/:id/quantity").patch(authRequired, requireRole("printer"), controller.updateQuantity);
productRouter.route("/:id/like").post(authRequired, requireRole("client"), controller.like);
productRouter.route("/:id/dislike").post(authRequired, requireRole("client"), controller.dislike);

export default productRouter;
