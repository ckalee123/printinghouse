import express from "express";
import fs from "fs";
import path from "path";
import { UserModel } from "../models/user.model";
import { isValidProfileImageDimensions } from "../utils/validators";
import { toSafeUser } from "../utils/sanitize";
import { AppError } from "../middleware/error.middleware";

function removeUploadedFile(file?: Express.Multer.File) {
    if (file) {
        fs.unlink(file.path, () => undefined);
    }
}

export class UserController {
    me = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const user = await UserModel.findById(req.userId);
            if (!user) {
                throw new AppError("Korisnik ne postoji", 404);
            }
            res.json(toSafeUser(user));
        } catch (err) {
            next(err);
        }
    };

    updateMe = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const user = await UserModel.findById(req.userId);
            if (!user) {
                removeUploadedFile(req.file);
                throw new AppError("Korisnik ne postoji", 404);
            }

            if (req.file) {
                if (!isValidProfileImageDimensions(req.file.path)) {
                    removeUploadedFile(req.file);
                    throw new AppError("Profilna slika mora biti između 100x100 i 250x250 piksela");
                }
                const oldImage = user.get("profileImage");
                if (oldImage && oldImage !== "default_profile_image.jpg") {
                    fs.unlink(path.join(__dirname, "..", "..", "uploads", oldImage), () => undefined);
                }
                user.set("profileImage", req.file.filename);
            }

            const { firstName, lastName, phone, email, companyName, address, city } = req.body;
            if (firstName) user.set("firstName", firstName);
            if (lastName) user.set("lastName", lastName);
            if (phone) user.set("phone", phone);
            if (email && email.toLowerCase() !== user.get("email")) {
                const existing = await UserModel.findOne({ email: email.toLowerCase(), _id: { $ne: user.id } });
                if (existing) {
                    removeUploadedFile(req.file);
                    throw new AppError("Nalog sa ovom e-mejl adresom već postoji");
                }
                user.set("email", email);
            }

            const role = user.get("role");
            if ((role === "client" && user.get("isCompany")) || role === "printer") {
                if (companyName) user.set("companyName", companyName);
                if (address) user.set("address", address);
                if (city) user.set("city", city);
            }

            await user.save();
            res.json(toSafeUser(user));
        } catch (err) {
            next(err);
        }
    };
}
