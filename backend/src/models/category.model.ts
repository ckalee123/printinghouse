import mongoose, { Schema } from "mongoose";

const subcategorySchema = new Schema({
    name: { type: String, required: true }
});

const categorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        subcategories: { type: [subcategorySchema], default: [] }
    },
    { collection: "categories", timestamps: true }
);

export const CategoryModel = mongoose.model("Category", categorySchema);
