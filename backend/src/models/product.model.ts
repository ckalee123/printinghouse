import mongoose, { Schema } from "mongoose";

const printingServiceSchema = new Schema(
    {
        idUsluge: { type: String, required: true },
        tipStampe: { type: String, required: true },
        dodatnaCenaPoKomadu: { type: Number, required: true, min: 0 },
        maxSirinaMm: { type: Number, default: null },
        maxVisinaMm: { type: Number, default: null }
    },
    { _id: false }
);

const ratingEventSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

const productSchema = new Schema(
    {
        printerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        sifra: { type: String, default: null },
        naziv: { type: String, required: true },
        opis: { type: String, default: "" },
        kategorija: { type: String, required: true },
        potkategorija: { type: String, required: true },
        jedinicnaCena: { type: Number, required: true, min: 0 },
        kolicinaNaLageru: { type: Number, required: true, min: 0, default: 0 },
        dostupneBoje: { type: [String], default: ["Bela"] },
        slikaUrl: { type: String, default: null },
        dodatneSlike: { type: [String], default: [] },
        uslugeStampe: { type: [printingServiceSchema], default: [] },
        likes: { type: [ratingEventSchema], default: [] },
        dislikes: { type: [ratingEventSchema], default: [] }
    },
    { collection: "products", timestamps: true }
);

export const ProductModel = mongoose.model("Product", productSchema);
