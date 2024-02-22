const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderDetailsSchema = new Schema(
    {
        order_id: {
            type: String,
            required: true,
        },
        product_id: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("OrderDetail", OrderDetailsSchema);
