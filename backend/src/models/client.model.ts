import { Schema } from "mongoose";
import { UserModel } from "./user.model";

const clientSchema = new Schema({
    isCompany: { type: Boolean, default: false },
    companyName: { type: String },
    address: { type: String },
    city: { type: String },
    registrationNumber: {
        type: String,
        match: /^\d{8}$/,
        unique: true,
        sparse: true
    },
    pib: {
        type: String,
        match: /^[1-9]\d{8}$/,
        unique: true,
        sparse: true
    }
});

export const ClientModel = UserModel.discriminator("client", clientSchema);
