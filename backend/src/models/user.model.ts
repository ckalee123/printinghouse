import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true, trim: true },
        passwordHash: { type: String, required: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        profileImage: { type: String, default: "default_profile_image.jpg" },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" }
    },
    { collection: "users", timestamps: true, discriminatorKey: "role" }
);

export const UserModel = mongoose.model("User", userSchema);
