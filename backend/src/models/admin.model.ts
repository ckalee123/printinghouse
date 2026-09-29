import { Schema } from "mongoose";
import { UserModel } from "./user.model";

const adminSchema = new Schema({});

export const AdminModel = UserModel.discriminator("admin", adminSchema);
