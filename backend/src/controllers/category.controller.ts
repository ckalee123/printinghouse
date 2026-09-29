import express from "express";
import { CategoryModel } from "../models/category.model";
import { ProductModel } from "../models/product.model";
import { AppError } from "../middleware/error.middleware";

export class CategoryController {
    list = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const categories = await CategoryModel.find().sort({ name: 1 });
            res.json(categories);
        } catch (err) {
            next(err);
        }
    };

    listWithActiveProducts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const activeCategoryNames: string[] = await ProductModel.distinct("kategorija", { kolicinaNaLageru: { $gt: 0 } });
            const categories = await CategoryModel.find({ name: { $in: activeCategoryNames } }).sort({ name: 1 });
            res.json(categories);
        } catch (err) {
            next(err);
        }
    };

    create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { name } = req.body;
            if (!name) {
                throw new AppError("Naziv kategorije je obavezan");
            }
            const existing = await CategoryModel.findOne({ name });
            if (existing) {
                throw new AppError("Kategorija sa ovim nazivom već postoji");
            }
            const category = await CategoryModel.create({ name, subcategories: [] });
            res.status(201).json(category);
        } catch (err) {
            next(err);
        }
    };

    update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { name } = req.body;
            const category = await CategoryModel.findById(req.params.id);
            if (!category) {
                throw new AppError("Kategorija ne postoji", 404);
            }
            if (name) category.name = name;
            await category.save();
            res.json(category);
        } catch (err) {
            next(err);
        }
    };

    remove = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const category = await CategoryModel.findByIdAndDelete(req.params.id);
            if (!category) {
                throw new AppError("Kategorija ne postoji", 404);
            }
            res.json({ message: "Kategorija je obrisana" });
        } catch (err) {
            next(err);
        }
    };

    addSubcategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { name } = req.body;
            if (!name) {
                throw new AppError("Naziv potkategorije je obavezan");
            }
            const category = await CategoryModel.findById(req.params.id);
            if (!category) {
                throw new AppError("Kategorija ne postoji", 404);
            }
            category.subcategories.push({ name } as any);
            await category.save();
            res.status(201).json(category);
        } catch (err) {
            next(err);
        }
    };

    removeSubcategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const category = await CategoryModel.findById(req.params.id);
            if (!category) {
                throw new AppError("Kategorija ne postoji", 404);
            }
            (category.subcategories as any).pull({ _id: req.params.subId });
            await category.save();
            res.json(category);
        } catch (err) {
            next(err);
        }
    };
}
