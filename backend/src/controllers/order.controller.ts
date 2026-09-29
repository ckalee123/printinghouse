import express from "express";
import { OrderModel } from "../models/order.model";
import { ProductModel } from "../models/product.model";
import { UserModel } from "../models/user.model";
import { AppError } from "../middleware/error.middleware";

interface CartItemInput {
    productId: string;
    kolicina: number;
    boja?: string;
    uslugeIds?: string[];
    customization?: { type: "text" | null; value: string | null };
}

export class OrderController {
    checkout = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const client = await UserModel.findById(req.userId);
            if (!client) {
                throw new AppError("Korisnik ne postoji", 404);
            }
            if (client.get("isCompany")) {
                throw new AppError("Pravna lica naručuju putem javnih nabavki, ne direktnim naručivanjem");
            }

            const items: CartItemInput[] = req.body.items;
            if (!Array.isArray(items) || !items.length) {
                throw new AppError("Korpa je prazna");
            }

            const products = await ProductModel.find({ _id: { $in: items.map((i) => i.productId) } });
            const productMap = new Map(products.map((p) => [p._id.toString(), p]));

            for (const item of items) {
                const product = productMap.get(item.productId);
                if (!product) {
                    throw new AppError("Jedan od proizvoda više ne postoji");
                }
                if (item.kolicina < 1 || item.kolicina > product.kolicinaNaLageru) {
                    throw new AppError(`Nema dovoljno proizvoda "${product.naziv}" trenutno na stanju`);
                }
            }

            const byPrinter = new Map<string, CartItemInput[]>();
            for (const item of items) {
                const printerId = productMap.get(item.productId)!.printerId.toString();
                if (!byPrinter.has(printerId)) byPrinter.set(printerId, []);
                byPrinter.get(printerId)!.push(item);
            }

            const createdOrders = [];
            for (const [printerId, printerItems] of byPrinter) {
                const printer = await UserModel.findById(printerId);
                const orderItems = [];
                let ukupanIznos = 0;

                for (const item of printerItems) {
                    const product = productMap.get(item.productId)!;
                    const selectedUsluge = (product.uslugeStampe as any[]).filter((u) => (item.uslugeIds || []).includes(u.idUsluge));
                    const cenaPoKomadu = product.jedinicnaCena + selectedUsluge.reduce((sum, u) => sum + u.dodatnaCenaPoKomadu, 0);
                    const ukupno = cenaPoKomadu * item.kolicina;
                    ukupanIznos += ukupno;

                    orderItems.push({
                        productId: product._id,
                        naziv: product.naziv,
                        kolicina: item.kolicina,
                        boja: item.boja || null,
                        usluge: selectedUsluge.map((u) => ({ idUsluge: u.idUsluge, tipStampe: u.tipStampe, dodatnaCenaPoKomadu: u.dodatnaCenaPoKomadu })),
                        customization: item.customization || { type: null, value: null },
                        cenaPoKomadu,
                        ukupno
                    });

                    const updated = await ProductModel.findOneAndUpdate(
                        { _id: product._id, kolicinaNaLageru: { $gte: item.kolicina } },
                        { $inc: { kolicinaNaLageru: -item.kolicina } }
                    );
                    if (!updated) {
                        throw new AppError(`Nema dovoljno proizvoda "${product.naziv}" trenutno na stanju`);
                    }
                }

                const order = await OrderModel.create({
                    clientId: client.id,
                    printerId,
                    nazivStamparije: printer?.get("companyName") || "",
                    grad: printer?.get("city") || "",
                    items: orderItems,
                    ukupanIznos,
                    status: "naruceno"
                });
                createdOrders.push(order);
            }

            res.status(201).json({ orders: createdOrders });
        } catch (err) {
            next(err);
        }
    };

    listMine = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const orders = await OrderModel.find({ clientId: req.userId }).sort({ createdAt: -1 });
            res.json(orders);
        } catch (err) {
            next(err);
        }
    };

    cancel = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const order = await OrderModel.findOne({ _id: req.params.id, clientId: req.userId });
            if (!order) {
                throw new AppError("Narudžbina ne postoji", 404);
            }
            if (order.status !== "naruceno") {
                throw new AppError("Narudžbina se više ne može otkazati");
            }
            for (const item of order.items) {
                await ProductModel.findByIdAndUpdate(item.productId, { $inc: { kolicinaNaLageru: item.kolicina } });
            }
            await OrderModel.deleteOne({ _id: order.id });
            res.json({ message: "Narudžbina je otkazana" });
        } catch (err) {
            next(err);
        }
    };

    listForPrinter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const orders = await OrderModel.find({ printerId: req.userId, procurementId: null }).sort({ createdAt: -1 });
            res.json(orders);
        } catch (err) {
            next(err);
        }
    };

    updateStatus = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { status } = req.body;
            const order = await OrderModel.findOne({ _id: req.params.id, printerId: req.userId });
            if (!order) {
                throw new AppError("Narudžbina ne postoji", 404);
            }
            const transitions: Record<string, string[]> = {
                naruceno: ["u_stampi"],
                u_stampi: ["isporuceno"]
            };
            const allowed = transitions[order.status] || [];
            if (!allowed.includes(status)) {
                throw new AppError(`Nije moguć prelaz iz statusa "${order.status}" u "${status}"`);
            }
            order.status = status;
            await order.save();
            res.json(order);
        } catch (err) {
            next(err);
        }
    };

    markReceived = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const order = await OrderModel.findOne({ _id: req.params.id, clientId: req.userId });
            if (!order) {
                throw new AppError("Narudžbina ne postoji", 404);
            }
            if (order.status !== "isporuceno") {
                throw new AppError("Narudžbina još uvek nije isporučena");
            }
            order.status = "primljeno";
            await order.save();
            res.json(order);
        } catch (err) {
            next(err);
        }
    };

    archive = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const orders = await OrderModel.find({
                clientId: req.userId,
                status: { $in: ["isporuceno", "primljeno"] }
            }).sort({ createdAt: -1 });

            const rows = orders.flatMap((order) =>
                order.items.map((item) => ({
                    orderId: order.id,
                    status: order.status,
                    createdAt: order.createdAt,
                    nazivStamparije: order.nazivStamparije,
                    productId: item.productId,
                    naziv: item.naziv,
                    kolicina: item.kolicina
                }))
            );

            res.json(rows);
        } catch (err) {
            next(err);
        }
    };
}
