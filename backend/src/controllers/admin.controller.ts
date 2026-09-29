import express from "express";
import { UserModel } from "../models/user.model";
import { toSafeUser } from "../utils/sanitize";
import { AppError } from "../middleware/error.middleware";
import { sendEmail } from "../services/email.service";

export class AdminController {
    listUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { role, q } = req.query as { role?: string; q?: string };
            const filter: any = { role: { $ne: "admin" } };
            if (role) filter.role = role;
            if (q) {
                filter.$or = [
                    { username: { $regex: q, $options: "i" } },
                    { email: { $regex: q, $options: "i" } },
                    { firstName: { $regex: q, $options: "i" } },
                    { lastName: { $regex: q, $options: "i" } }
                ];
            }
            const users = await UserModel.find(filter).sort({ createdAt: -1 });
            res.json(users.map(toSafeUser));
        } catch (err) {
            next(err);
        }
    };

    updateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user || user.get("role") === "admin") {
                throw new AppError("Korisnik ne postoji", 404);
            }
            const { firstName, lastName, phone, email, status } = req.body;
            if (firstName) user.set("firstName", firstName);
            if (lastName) user.set("lastName", lastName);
            if (phone) user.set("phone", phone);
            if (email) user.set("email", email);
            if (status) user.set("status", status);
            await user.save();
            res.json(toSafeUser(user));
        } catch (err) {
            next(err);
        }
    };

    deleteUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const user = await UserModel.findOne({ _id: req.params.id, role: { $ne: "admin" } });
            if (!user) {
                throw new AppError("Korisnik ne postoji", 404);
            }
            await UserModel.deleteOne({ _id: user.id });
            res.json({ message: "Korisnik je obrisan" });
        } catch (err) {
            next(err);
        }
    };

    listPending = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const users = await UserModel.find({ status: "pending" }).sort({ createdAt: 1 });
            res.json(users.map(toSafeUser));
        } catch (err) {
            next(err);
        }
    };

    approve = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                throw new AppError("Korisnik ne postoji", 404);
            }
            user.set("status", "approved");
            await user.save();
            await sendEmail(
                user.get("email"),
                "Printing House - nalog odobren",
                `<p>Zdravo ${user.get("firstName")},</p><p>Vaš nalog je odobren. Sada se možete prijaviti na sistem.</p>`
            ).catch((e) => console.error("Greška pri slanju mejla o odobrenju:", e));
            res.json(toSafeUser(user));
        } catch (err) {
            next(err);
        }
    };

    reject = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                throw new AppError("Korisnik ne postoji", 404);
            }
            user.set("status", "rejected");
            await user.save();
            await sendEmail(
                user.get("email"),
                "Printing House - zahtev za registraciju odbijen",
                `<p>Zdravo ${user.get("firstName")},</p><p>Nažalost, vaš zahtev za registraciju je odbijen.</p>`
            ).catch((e) => console.error("Greška pri slanju mejla o odbijanju:", e));
            res.json(toSafeUser(user));
        } catch (err) {
            next(err);
        }
    };
}
