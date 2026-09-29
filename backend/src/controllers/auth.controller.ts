import express from "express";
import bcrypt from "bcryptjs";
import fs from "fs";
import { UserModel } from "../models/user.model";
import { ClientModel } from "../models/client.model";
import { PrinterModel } from "../models/printer.model";
import { isValidPassword, isValidProfileImageDimensions, REGISTRATION_NUMBER_REGEX, PIB_REGEX } from "../utils/validators";
import { signToken } from "../utils/jwt";
import { toSafeUser } from "../utils/sanitize";
import { AppError } from "../middleware/error.middleware";
import { closeExpiredProcurementsForClient } from "./procurement.controller";

function removeUploadedFile(file?: Express.Multer.File) {
    if (file) {
        fs.unlink(file.path, () => undefined);
    }
}

export class AuthController {
    registerClient = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { username, password, firstName, lastName, phone, email, isCompany, companyName, address, city, registrationNumber, pib } = req.body;
            const companyFlag = isCompany === "true" || isCompany === true;

            if (!username || !password || !firstName || !lastName || !phone || !email) {
                removeUploadedFile(req.file);
                throw new AppError("Sva obavezna polja moraju biti popunjena");
            }
            if (!isValidPassword(password)) {
                removeUploadedFile(req.file);
                throw new AppError("Lozinka ne ispunjava propisane uslove (8-12 karaktera, veliko slovo, broj, specijalni karakter, počinje slovom)");
            }
            if (companyFlag) {
                if (!companyName || !address || !city || !registrationNumber || !pib) {
                    removeUploadedFile(req.file);
                    throw new AppError("Za pravna lica su obavezni naziv institucije, adresa, grad, matični broj i PIB");
                }
                if (!REGISTRATION_NUMBER_REGEX.test(registrationNumber)) {
                    removeUploadedFile(req.file);
                    throw new AppError("Matični broj mora imati tačno 8 cifara");
                }
                if (!PIB_REGEX.test(pib)) {
                    removeUploadedFile(req.file);
                    throw new AppError("PIB mora imati 9 cifara i ne sme počinjati nulom");
                }
            }

            if (req.file) {
                if (!isValidProfileImageDimensions(req.file.path)) {
                    removeUploadedFile(req.file);
                    throw new AppError("Profilna slika mora biti između 100x100 i 250x250 piksela");
                }
            }

            const existingUsername = await UserModel.findOne({ username });
            if (existingUsername) {
                removeUploadedFile(req.file);
                throw new AppError("Korisničko ime već postoji");
            }
            const existingEmail = await UserModel.findOne({ email: email.toLowerCase() });
            if (existingEmail) {
                removeUploadedFile(req.file);
                throw new AppError("Nalog sa ovom e-mejl adresom već postoji");
            }

            const passwordHash = await bcrypt.hash(password, 10);

            await ClientModel.create({
                username,
                passwordHash,
                email,
                firstName,
                lastName,
                phone,
                profileImage: req.file ? req.file.filename : undefined,
                status: "pending",
                isCompany: companyFlag,
                companyName: companyFlag ? companyName : undefined,
                address: companyFlag ? address : undefined,
                city: companyFlag ? city : undefined,
                registrationNumber: companyFlag ? registrationNumber : undefined,
                pib: companyFlag ? pib : undefined
            });

            res.status(201).json({ message: "Registracija je uspešno poslata. Vaš nalog čeka odobrenje administratora." });
        } catch (err) {
            next(err);
        }
    };

    registerPrinter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { username, password, firstName, lastName, phone, email, companyName, address, city, registrationNumber, pib } = req.body;

            if (!username || !password || !firstName || !lastName || !phone || !email || !companyName || !address || !city || !registrationNumber || !pib) {
                removeUploadedFile(req.file);
                throw new AppError("Sva obavezna polja moraju biti popunjena");
            }
            if (!isValidPassword(password)) {
                removeUploadedFile(req.file);
                throw new AppError("Lozinka ne ispunjava propisane uslove (8-12 karaktera, veliko slovo, broj, specijalni karakter, počinje slovom)");
            }
            if (!REGISTRATION_NUMBER_REGEX.test(registrationNumber)) {
                removeUploadedFile(req.file);
                throw new AppError("Matični broj mora imati tačno 8 cifara");
            }
            if (!PIB_REGEX.test(pib)) {
                removeUploadedFile(req.file);
                throw new AppError("PIB mora imati 9 cifara i ne sme počinjati nulom");
            }
            if (req.file && !isValidProfileImageDimensions(req.file.path)) {
                removeUploadedFile(req.file);
                throw new AppError("Profilna slika mora biti između 100x100 i 250x250 piksela");
            }

            const existingUsername = await UserModel.findOne({ username });
            if (existingUsername) {
                removeUploadedFile(req.file);
                throw new AppError("Korisničko ime već postoji");
            }
            const existingEmail = await UserModel.findOne({ email: email.toLowerCase() });
            if (existingEmail) {
                removeUploadedFile(req.file);
                throw new AppError("Nalog sa ovom e-mejl adresom već postoji");
            }

            const passwordHash = await bcrypt.hash(password, 10);

            await PrinterModel.create({
                username,
                passwordHash,
                email,
                firstName,
                lastName,
                phone,
                profileImage: req.file ? req.file.filename : undefined,
                status: "pending",
                companyName,
                address,
                city,
                registrationNumber,
                pib
            });

            res.status(201).json({ message: "Registracija je uspešno poslata. Vaš nalog čeka odobrenje administratora." });
        } catch (err) {
            next(err);
        }
    };

    login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                throw new AppError("Unesite korisničko ime i lozinku");
            }
            const user = await UserModel.findOne({ username });
            if (!user || (user.get("role") as string) === "admin") {
                throw new AppError("Pogrešno korisničko ime ili lozinka");
            }
            const passwordMatches = await bcrypt.compare(password, user.get("passwordHash"));
            if (!passwordMatches) {
                throw new AppError("Pogrešno korisničko ime ili lozinka");
            }
            if (user.get("status") === "pending") {
                throw new AppError("Vaš nalog još uvek čeka odobrenje administratora", 403);
            }
            if (user.get("status") === "rejected") {
                throw new AppError("Vaš zahtev za registraciju je odbijen", 403);
            }

            if (user.get("role") === "client" && user.get("isCompany")) {
                await closeExpiredProcurementsForClient(user.id);
            }

            const token = signToken({ userId: user.id, role: user.get("role") });
            res.json({ token, user: toSafeUser(user) });
        } catch (err) {
            next(err);
        }
    };

    adminLogin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                throw new AppError("Unesite korisničko ime i lozinku");
            }
            const user = await UserModel.findOne({ username, role: "admin" });
            if (!user) {
                throw new AppError("Pogrešno korisničko ime ili lozinka");
            }
            const passwordMatches = await bcrypt.compare(password, user.get("passwordHash"));
            if (!passwordMatches) {
                throw new AppError("Pogrešno korisničko ime ili lozinka");
            }

            const token = signToken({ userId: user.id, role: "admin" });
            res.json({ token, user: toSafeUser(user) });
        } catch (err) {
            next(err);
        }
    };

}
