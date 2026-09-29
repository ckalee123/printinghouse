import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        naziv: { type: String, required: true },
        kolicina: { type: Number, required: true, min: 1 },
        boja: { type: String, default: null },
        usluge: {
            type: [
                {
                    idUsluge: String,
                    tipStampe: String,
                    dodatnaCenaPoKomadu: Number
                }
            ],
            default: []
        },
        customization: {
            type: { type: String, enum: ["text", null], default: null },
            value: { type: String, default: null }
        },
        cenaPoKomadu: { type: Number, required: true },
        ukupno: { type: Number, required: true }
    },
    { _id: false }
);

const orderSchema = new Schema(
    {
        clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        printerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        nazivStamparije: { type: String, required: true },
        grad: { type: String, required: true },
        items: { type: [orderItemSchema], required: true },
        ukupanIznos: { type: Number, required: true },
        status: {
            type: String,
            enum: ["naruceno", "u_stampi", "isporuceno", "primljeno"],
            default: "naruceno"
        },
        procurementId: { type: Schema.Types.ObjectId, ref: "Procurement", default: null }
    },
    { collection: "orders", timestamps: true }
);

export const OrderModel = mongoose.model("Order", orderSchema);
