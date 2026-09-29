import express from "express";
import { ProcurementModel } from "../models/procurement.model";
import { ProductModel } from "../models/product.model";
import { OrderModel } from "../models/order.model";
import { UserModel } from "../models/user.model";
import { AppError } from "../middleware/error.middleware";
import { sendEmail } from "../services/email.service";
import { generateProcurementReportPdf } from "../services/pdf.service";

const PROCUREMENT_DURATION_MS = 10 * 60 * 1000;

export async function closeExpiredProcurementsForClient(clientId: string) {
    const expired = await ProcurementModel.find({
        clientId,
        status: "open",
        deadline: { $lte: new Date() }
    });

    for (const procurement of expired) {
        const validBids = procurement.bids.filter((bid: any) =>
            procurement.items.every((reqItem: any) => {
                const match = bid.items.find((bi: any) => bi.naziv === reqItem.naziv);
                return match && match.kolicinaDostupna >= reqItem.kolicina;
            })
        );

        let winningBid: any = null;
        for (const bid of validBids) {
            if (!winningBid || bid.ukupnaCena < winningBid.ukupnaCena) {
                winningBid = bid;
            }
        }

        if (winningBid) {
            const printer = await UserModel.findById(winningBid.printerId);
            const orderItems = [];
            let ukupanIznos = 0;

            for (const reqItem of procurement.items) {
                const bidItem = winningBid.items.find((bi: any) => bi.naziv === reqItem.naziv);
                const ukupno = bidItem.cenaPoKomadu * reqItem.kolicina;
                ukupanIznos += ukupno;
                orderItems.push({
                    productId: bidItem.productId,
                    naziv: reqItem.naziv,
                    kolicina: reqItem.kolicina,
                    boja: null,
                    usluge: [],
                    customization: { type: null, value: null },
                    cenaPoKomadu: bidItem.cenaPoKomadu,
                    ukupno
                });
                await ProductModel.findByIdAndUpdate(bidItem.productId, { $inc: { kolicinaNaLageru: -reqItem.kolicina } });
            }

            const order = await OrderModel.create({
                clientId: procurement.clientId,
                printerId: winningBid.printerId,
                nazivStamparije: printer?.get("companyName") || "",
                grad: printer?.get("city") || "",
                items: orderItems,
                ukupanIznos,
                status: "u_stampi",
                procurementId: procurement.id
            });

            procurement.winningPrinterId = winningBid.printerId;
            procurement.resultingOrderId = order.id;
        }

        procurement.status = "closed";
        await procurement.save();
    }
}

export class ProcurementController {
    create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const client = await UserModel.findById(req.userId);
            if (!client || !client.get("isCompany")) {
                throw new AppError("Samo klijenti - pravna lica mogu da raspišu javnu nabavku");
            }

            const items = req.body.items;
            if (!Array.isArray(items) || !items.length) {
                throw new AppError("Lista traženih proizvoda ne sme biti prazna");
            }

            const procurement = await ProcurementModel.create({
                clientId: client.id,
                items: items.map((i: any) => ({ naziv: i.naziv, kategorija: i.kategorija, kolicina: Number(i.kolicina) })),
                deadline: new Date(Date.now() + PROCUREMENT_DURATION_MS),
                status: "open"
            });

            const printers = await UserModel.find({ role: "printer", status: "approved" });
            const itemsList = items.map((i: any) => `${i.naziv} (${i.kolicina} kom)`).join(", ");
            await Promise.all(
                printers.map((p: any) =>
                    sendEmail(
                        p.email,
                        "Printing House - nova javna nabavka",
                        `<p>Otvorena je nova javna nabavka (ID: ${procurement.id}).</p><p>Traženi proizvodi: ${itemsList}</p><p>Rok za dostavljanje ponuda: 10 minuta od objave.</p>`
                    ).catch((e) => console.error("Greška pri slanju mejla štampariji:", e))
                )
            );

            res.status(201).json(procurement);
        } catch (err) {
            next(err);
        }
    };

    listMine = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await closeExpiredProcurementsForClient(req.userId!);
            const procurements = await ProcurementModel.find({ clientId: req.userId }).sort({ createdAt: -1 });
            res.json(procurements);
        } catch (err) {
            next(err);
        }
    };

    listOpenForPrinter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const procurements = await ProcurementModel.find({
                status: "open",
                deadline: { $gt: new Date() }
            }).sort({ createdAt: -1 });
            res.json(procurements);
        } catch (err) {
            next(err);
        }
    };

    listAllForPrinter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const procurements = await ProcurementModel.find({
                "bids.printerId": req.userId
            }).sort({ createdAt: -1 });
            res.json(procurements);
        } catch (err) {
            next(err);
        }
    };

    submitBid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const procurement = await ProcurementModel.findById(req.params.id);
            if (!procurement) {
                throw new AppError("Javna nabavka ne postoji", 404);
            }
            if (procurement.status !== "open" || procurement.deadline.getTime() <= Date.now()) {
                throw new AppError("Rok za dostavljanje ponuda je istekao");
            }
            const alreadyBid = procurement.bids.some((b: any) => b.printerId.toString() === req.userId);
            if (alreadyBid) {
                throw new AppError("Već ste poslali ponudu za ovu javnu nabavku");
            }

            const items = req.body.items;
            if (!Array.isArray(items) || items.length !== procurement.items.length) {
                throw new AppError("Ponuda mora sadržati cenu za sve tražene proizvode");
            }

            let ukupnaCena = 0;
            const bidItems = [];
            for (const reqItem of procurement.items) {
                const offer = items.find((i: any) => i.naziv === reqItem.naziv);
                if (!offer || !offer.productId || offer.cenaPoKomadu === undefined) {
                    throw new AppError(`Nedostaje ponuda za proizvod "${reqItem.naziv}"`);
                }
                const product = await ProductModel.findOne({ _id: offer.productId, printerId: req.userId });
                if (!product) {
                    throw new AppError(`Proizvod za "${reqItem.naziv}" ne pripada vašoj štampariji`);
                }
                bidItems.push({
                    naziv: reqItem.naziv,
                    productId: product._id,
                    cenaPoKomadu: Number(offer.cenaPoKomadu),
                    kolicinaDostupna: product.kolicinaNaLageru
                });
                ukupnaCena += Number(offer.cenaPoKomadu) * reqItem.kolicina;
            }

            procurement.bids.push({ printerId: req.userId as any, items: bidItems, ukupnaCena, submittedAt: new Date() } as any);
            await procurement.save();

            res.status(201).json({ message: "Ponuda je uspešno poslata" });
        } catch (err) {
            next(err);
        }
    };

    getReportPdf = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const procurement = await ProcurementModel.findById(req.params.id);
            if (!procurement) {
                throw new AppError("Javna nabavka ne postoji", 404);
            }
            const isParticipant = procurement.bids.some((b: any) => b.printerId.toString() === req.userId);
            if (procurement.status !== "closed" || !isParticipant) {
                throw new AppError("Izveštaj još uvek nije dostupan");
            }

            const printerIds = procurement.bids.map((b: any) => b.printerId.toString());
            const printers = await UserModel.find({ _id: { $in: printerIds } });
            const printerNames = new Map(printers.map((p: any) => [p._id.toString(), p.companyName]));

            const pdfBuffer = await generateProcurementReportPdf(procurement, printerNames);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=izvestaj-${procurement.id}.pdf`);
            res.send(pdfBuffer);
        } catch (err) {
            next(err);
        }
    };
}
