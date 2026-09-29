import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        text: { type: String, required: true }
    },
    { collection: "comments", timestamps: true }
);

export const CommentModel = mongoose.model("Comment", commentSchema);
