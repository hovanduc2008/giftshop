const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        total_amount: {
            type: Number,
            required: true,
        },
        order_note: {
            type: String,
        },
        shipping_address: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        order_status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered"],
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Order", OrderSchema);
