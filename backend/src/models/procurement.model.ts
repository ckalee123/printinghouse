import mongoose, { Schema } from "mongoose";

const requestedItemSchema = new Schema(
    {
        naziv: { type: String, required: true },
        kategorija: { type: String, required: true },
        kolicina: { type: Number, required: true, min: 1 }
    },
    { _id: false }
);

const bidItemSchema = new Schema(
    {
        naziv: { type: String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        cenaPoKomadu: { type: Number, required: true, min: 0 },
        kolicinaDostupna: { type: Number, required: true, min: 0 }
    },
    { _id: false }
);

const bidSchema = new Schema(
    {
        printerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: { type: [bidItemSchema], required: true },
        ukupnaCena: { type: Number, required: true },
        submittedAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

const procurementSchema = new Schema(
    {
        clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: { type: [requestedItemSchema], required: true },
        deadline: { type: Date, required: true },
        status: { type: String, enum: ["open", "closed"], default: "open" },
        bids: { type: [bidSchema], default: [] },
        winningPrinterId: { type: Schema.Types.ObjectId, ref: "User", default: null },
        resultingOrderId: { type: Schema.Types.ObjectId, ref: "Order", default: null }
    },
    { collection: "procurements", timestamps: true }
);

export const ProcurementModel = mongoose.model("Procurement", procurementSchema);
