import express from "express";
import { CommentModel } from "../models/comment.model";
import { UserModel } from "../models/user.model";
import { AppError } from "../middleware/error.middleware";

export class CommentController {
    listForProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const comments = await CommentModel.find({ productId: req.params.productId }).sort({ createdAt: -1 }).limit(5);
            res.json(comments);
        } catch (err) {
            next(err);
        }
    };

    create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { productId, text } = req.body;
            if (!productId || !text || !text.trim()) {
                throw new AppError("Tekst komentara je obavezan");
            }
            const user = await UserModel.findById(req.userId);
            if (!user) {
                throw new AppError("Korisnik ne postoji", 404);
            }
            const comment = await CommentModel.create({
                productId,
                userId: user.id,
                username: user.get("username"),
                text: text.trim()
            });
            res.status(201).json(comment);
        } catch (err) {
            next(err);
        }
    };
}
