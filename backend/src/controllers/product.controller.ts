import express from "express";
import fs from "fs";
import { ProductModel } from "../models/product.model";
import { PrinterModel } from "../models/printer.model";
import { UserModel } from "../models/user.model";
import { AppError } from "../middleware/error.middleware";

function ratingCounts(product: any) {
    return { likeCount: product.likes.length, dislikeCount: product.dislikes.length };
}

function toListItem(product: any, printer: any) {
    return {
        id: product._id.toString(),
        naziv: product.naziv,
        kategorija: product.kategorija,
        potkategorija: product.potkategorija,
        slikaUrl: product.slikaUrl,
        nazivStamparije: printer?.companyName || "",
        grad: printer?.city || "",
        ...ratingCounts(product)
    };
}

function toPublicDetail(product: any, printer: any) {
    return {
        id: product._id.toString(),
        naziv: product.naziv,
        kategorija: product.kategorija,
        nazivStamparije: printer?.companyName || "",
        grad: printer?.city || "",
        slikaUrl: product.slikaUrl,
        dodatneSlike: product.dodatneSlike,
        ...ratingCounts(product)
    };
}

function toExtendedDetail(product: any, printer: any) {
    return {
        ...toPublicDetail(product, printer),
        printerId: printer?._id?.toString(),
        opis: product.opis,
        jedinicnaCena: product.jedinicnaCena,
        kolicinaNaLageru: product.kolicinaNaLageru,
        dostupneBoje: product.dostupneBoje,
        uslugeStampe: product.uslugeStampe
    };
}

function toOwnerDetail(product: any) {
    return {
        id: product._id.toString(),
        printerId: product.printerId,
        sifra: product.sifra,
        naziv: product.naziv,
        opis: product.opis,
        kategorija: product.kategorija,
        potkategorija: product.potkategorija,
        jedinicnaCena: product.jedinicnaCena,
        kolicinaNaLageru: product.kolicinaNaLageru,
        dostupneBoje: product.dostupneBoje,
        slikaUrl: product.slikaUrl,
        dodatneSlike: product.dodatneSlike,
        uslugeStampe: product.uslugeStampe,
        ...ratingCounts(product)
    };
}

export class ProductController {
    publicStats = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const printerCount = await UserModel.countDocuments({ role: "printer", status: "approved" });
            const activeProducts = await ProductModel.find({ kolicinaNaLageru: { $gt: 0 } });
            const top5 = activeProducts
                .sort((a: any, b: any) => b.likes.length - a.likes.length)
                .slice(0, 5);

            const printerIds = [...new Set(top5.map((p: any) => p.printerId.toString()))];
            const printers = await UserModel.find({ _id: { $in: printerIds } });
            const printerMap = new Map(printers.map((p: any) => [p._id.toString(), p]));

            res.json({
                printerCount,
                top5: top5.map((p: any) => toListItem(p, printerMap.get(p.printerId.toString())))
            });
        } catch (err) {
            next(err);
        }
    };

    search = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { q, category, sort, dir } = req.query as { q?: string; category?: string; sort?: string; dir?: string };

            const filter: any = { kolicinaNaLageru: { $gt: 0 } };
            if (q) {
                filter.naziv = { $regex: q, $options: "i" };
            }
            if (category && category !== "Sve kategorije") {
                filter.kategorija = category;
            }

            let query = ProductModel.find(filter);
            if (sort === "naziv") {
                query = query.sort({ naziv: dir === "desc" ? -1 : 1 });
            } else {
                query = query.sort({ createdAt: -1 });
            }

            const products = await query.exec();
            const printerIds = [...new Set(products.map((p: any) => p.printerId.toString()))];
            const printers = await UserModel.find({ _id: { $in: printerIds } });
            const printerMap = new Map(printers.map((p: any) => [p._id.toString(), p]));

            res.json(products.map((p: any) => toListItem(p, printerMap.get(p.printerId.toString()))));
        } catch (err) {
            next(err);
        }
    };

    getById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const product = await ProductModel.findById(req.params.id);
            if (!product) {
                throw new AppError("Proizvod ne postoji", 404);
            }
            const printer = await UserModel.findById(product.printerId);

            if (req.userId && req.userRole === "client") {
                res.json(toExtendedDetail(product, printer));
            } else {
                res.json(toPublicDetail(product, printer));
            }
        } catch (err) {
            next(err);
        }
    };

    listMine = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const products = await ProductModel.find({ printerId: req.userId }).sort({ createdAt: -1 });
            res.json(products.map(toOwnerDetail));
        } catch (err) {
            next(err);
        }
    };

    create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { sifra, naziv, opis, kategorija, potkategorija, jedinicnaCena, kolicinaNaLageru, dostupneBoje, uslugeStampe } = req.body;
            if (!naziv || !kategorija || !potkategorija || jedinicnaCena === undefined) {
                throw new AppError("Naziv, kategorija, potkategorija i jedinična cena su obavezni");
            }

            const files = req.files as { [field: string]: Express.Multer.File[] } | undefined;
            const slika = files?.["slika"]?.[0];
            const dodatneSlike = files?.["dodatneSlike"] || [];

            const product = await ProductModel.create({
                printerId: req.userId,
                sifra: sifra || null,
                naziv,
                opis: opis || "",
                kategorija,
                potkategorija,
                jedinicnaCena: Number(jedinicnaCena),
                kolicinaNaLageru: kolicinaNaLageru ? Number(kolicinaNaLageru) : 0,
                dostupneBoje: dostupneBoje ? JSON.parse(dostupneBoje) : ["Bela"],
                slikaUrl: slika ? slika.filename : null,
                dodatneSlike: dodatneSlike.map((f) => f.filename),
                uslugeStampe: uslugeStampe ? JSON.parse(uslugeStampe) : []
            });

            res.status(201).json(toOwnerDetail(product));
        } catch (err) {
            next(err);
        }
    };

    update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const product = await ProductModel.findOne({ _id: req.params.id, printerId: req.userId });
            if (!product) {
                throw new AppError("Proizvod ne postoji", 404);
            }

            const { sifra, naziv, opis, kategorija, potkategorija, jedinicnaCena, kolicinaNaLageru, dostupneBoje, uslugeStampe } = req.body;
            if (sifra !== undefined) product.sifra = sifra;
            if (naziv !== undefined) product.naziv = naziv;
            if (opis !== undefined) product.opis = opis;
            if (kategorija !== undefined) product.kategorija = kategorija;
            if (potkategorija !== undefined) product.potkategorija = potkategorija;
            if (jedinicnaCena !== undefined) product.jedinicnaCena = Number(jedinicnaCena);
            if (kolicinaNaLageru !== undefined) product.kolicinaNaLageru = Number(kolicinaNaLageru);
            if (dostupneBoje !== undefined) product.dostupneBoje = JSON.parse(dostupneBoje);
            if (uslugeStampe !== undefined) product.uslugeStampe = JSON.parse(uslugeStampe);

            const files = req.files as { [field: string]: Express.Multer.File[] } | undefined;
            const slika = files?.["slika"]?.[0];
            const dodatneSlike = files?.["dodatneSlike"];
            if (slika) product.slikaUrl = slika.filename;
            if (dodatneSlike && dodatneSlike.length) product.dodatneSlike = dodatneSlike.map((f) => f.filename);

            await product.save();
            res.json(toOwnerDetail(product));
        } catch (err) {
            next(err);
        }
    };

    updateQuantity = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { kolicinaNaLageru } = req.body;
            if (kolicinaNaLageru === undefined || Number(kolicinaNaLageru) < 0) {
                throw new AppError("Nevažeća količina");
            }
            const product = await ProductModel.findOneAndUpdate(
                { _id: req.params.id, printerId: req.userId },
                { kolicinaNaLageru: Number(kolicinaNaLageru) },
                { new: true }
            );
            if (!product) {
                throw new AppError("Proizvod ne postoji", 404);
            }
            res.json(toOwnerDetail(product));
        } catch (err) {
            next(err);
        }
    };

    importJson = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            if (!req.file) {
                throw new AppError("Nedostaje JSON fajl");
            }
            let payload: any;
            try {
                payload = JSON.parse(req.file.buffer.toString("utf-8"));
            } catch {
                throw new AppError("JSON fajl nije validan");
            }

            const proizvodi = payload.proizvodi;
            if (!Array.isArray(proizvodi)) {
                throw new AppError("JSON fajl mora sadržati niz 'proizvodi'");
            }

            const created = [];
            for (const item of proizvodi) {
                const product = await ProductModel.create({
                    printerId: req.userId,
                    sifra: item.sifra || null,
                    naziv: item.naziv,
                    opis: item.opis || "",
                    kategorija: item.kategorija,
                    potkategorija: item.potkategorija,
                    jedinicnaCena: Number(item.jedinicnaCena) || 0,
                    kolicinaNaLageru: Number(item.kolicinaNaLageru) || 0,
                    dostupneBoje: item.dostupneBoje || ["Bela"],
                    slikaUrl: null,
                    dodatneSlike: [],
                    uslugeStampe: (item.uslugeStampe || []).map((u: any) => ({
                        idUsluge: u.idUsluge,
                        tipStampe: u.tipStampe,
                        dodatnaCenaPoKomadu: Number(u.dodatnaCenaPoKomadu) || 0,
                        maxSirinaMm: u.maxSirinaMm ?? null,
                        maxVisinaMm: u.maxVisinaMm ?? null
                    }))
                });
                created.push(toOwnerDetail(product));
            }

            res.status(201).json({ message: `Uvezeno je ${created.length} proizvoda. Slike možete naknadno dodati.`, products: created });
        } catch (err) {
            next(err);
        }
    };

    setProductImage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const product = await ProductModel.findOne({ _id: req.params.id, printerId: req.userId });
            if (!product) {
                throw new AppError("Proizvod ne postoji", 404);
            }
            const files = req.files as { [field: string]: Express.Multer.File[] } | undefined;
            const slika = files?.["slika"]?.[0];
            const dodatneSlike = files?.["dodatneSlike"];
            if (slika) product.slikaUrl = slika.filename;
            if (dodatneSlike && dodatneSlike.length) product.dodatneSlike = dodatneSlike.map((f) => f.filename);
            await product.save();
            res.json(toOwnerDetail(product));
        } catch (err) {
            next(err);
        }
    };

    like = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const product = await ProductModel.findById(req.params.id);
            if (!product) {
                throw new AppError("Proizvod ne postoji", 404);
            }
            const userId = req.userId!;
            product.dislikes = product.dislikes.filter((d: any) => d.userId.toString() !== userId) as any;
            const alreadyLiked = product.likes.some((l: any) => l.userId.toString() === userId);
            if (alreadyLiked) {
                product.likes = product.likes.filter((l: any) => l.userId.toString() !== userId) as any;
            } else {
                product.likes.push({ userId, createdAt: new Date() } as any);
            }
            await product.save();
            res.json(ratingCounts(product));
        } catch (err) {
            next(err);
        }
    };

    dislike = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const product = await ProductModel.findById(req.params.id);
            if (!product) {
                throw new AppError("Proizvod ne postoji", 404);
            }
            const userId = req.userId!;
            product.likes = product.likes.filter((l: any) => l.userId.toString() !== userId) as any;
            const alreadyDisliked = product.dislikes.some((d: any) => d.userId.toString() === userId);
            if (alreadyDisliked) {
                product.dislikes = product.dislikes.filter((d: any) => d.userId.toString() !== userId) as any;
            } else {
                product.dislikes.push({ userId, createdAt: new Date() } as any);
            }
            await product.save();
            res.json(ratingCounts(product));
        } catch (err) {
            next(err);
        }
    };
}
