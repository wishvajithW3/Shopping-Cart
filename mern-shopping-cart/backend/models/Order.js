import mongoose from "mongoose";
const orderItemSchema = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, name: String, image: String, price: Number, quantity: Number }, { _id: false });
const orderSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, items: [orderItemSchema], totalPrice: { type: Number, required: true }, status: { type: String, enum: ["Pending", "Confirmed"], default: "Pending" } }, { timestamps: true });
export default mongoose.model("Order", orderSchema);
