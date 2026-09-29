import { Schema } from "mongoose";
import { UserModel } from "./user.model";

const printerSchema = new Schema({
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    registrationNumber: { type: String, required: true, match: /^\d{8}$/, unique: true },
    pib: { type: String, required: true, match: /^[1-9]\d{8}$/, unique: true }
});

export const PrinterModel = UserModel.discriminator("printer", printerSchema);
