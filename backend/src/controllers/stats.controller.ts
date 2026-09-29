import express from "express";
import { OrderModel } from "../models/order.model";
import { ProductModel } from "../models/product.model";
import { UserModel } from "../models/user.model";

function startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getUTCDay();
    const diff = (day + 6) % 7;
    d.setUTCDate(d.getUTCDate() - diff);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

function weekLabel(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export class StatsController {
    revenueByPrinter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            const agg = await OrderModel.aggregate([
                { $match: { createdAt: { $gte: threeMonthsAgo } } },
                { $group: { _id: "$printerId", total: { $sum: "$ukupanIznos" } } },
                { $sort: { total: -1 } },
                { $limit: 10 }
            ]);

            const printers = await UserModel.find({ _id: { $in: agg.map((a) => a._id) } });
            const nameMap = new Map(printers.map((p: any) => [p._id.toString(), p.companyName]));

            res.json(
                agg.map((a) => ({
                    printer: nameMap.get(a._id.toString()) || a._id.toString(),
                    total: a.total
                }))
            );
        } catch (err) {
            next(err);
        }
    };

    mostOrderedProducts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const agg = await OrderModel.aggregate([
                { $match: { createdAt: { $gte: oneMonthAgo } } },
                { $unwind: "$items" },
                { $group: { _id: "$items.naziv", kolicina: { $sum: "$items.kolicina" } } },
                { $sort: { kolicina: -1 } },
                { $limit: 8 }
            ]);

            const total = agg.reduce((sum, a) => sum + a.kolicina, 0);
            res.json(
                agg.map((a) => ({
                    naziv: a._id,
                    kolicina: a.kolicina,
                    procenat: total ? Math.round((a.kolicina / total) * 1000) / 10 : 0
                }))
            );
        } catch (err) {
            next(err);
        }
    };

    productRatingOverTime = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const products = await ProductModel.find({
                $or: [{ "likes.0": { $exists: true } }, { "dislikes.0": { $exists: true } }]
            }).limit(12);

            if (!products.length) {
                res.json({ labels: [], datasets: [] });
                return;
            }

            let minDate = new Date();
            const productEvents = products.map((p: any) => {
                const events = [
                    ...p.likes.map((l: any) => ({ t: new Date(l.createdAt), delta: 1 })),
                    ...p.dislikes.map((d: any) => ({ t: new Date(d.createdAt), delta: -1 }))
                ].sort((a, b) => a.t.getTime() - b.t.getTime());
                if (events.length && events[0].t < minDate) minDate = events[0].t;
                return { naziv: p.naziv, events };
            });

            const start = startOfWeek(minDate);
            const now = new Date();
            const labels: string[] = [];
            for (let d = new Date(start); d <= now; d.setUTCDate(d.getUTCDate() + 7)) {
                labels.push(weekLabel(new Date(d)));
            }
            if (!labels.length) labels.push(weekLabel(start));

            const datasets = productEvents.map(({ naziv, events }) => {
                const data: number[] = [];
                let cumulative = 0;
                let eventIndex = 0;
                for (const label of labels) {
                    const weekEnd = new Date(label);
                    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
                    while (eventIndex < events.length && events[eventIndex].t < weekEnd) {
                        cumulative += events[eventIndex].delta;
                        eventIndex++;
                    }
                    data.push(cumulative);
                }
                return { label: naziv, data };
            });

            res.json({ labels, datasets });
        } catch (err) {
            next(err);
        }
    };
}
