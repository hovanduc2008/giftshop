const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const ProductsSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        description: {
            type: String,
        },
        content: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
        },
    },
    {
        timestamps: true,
    },
);

ProductsSchema.pre("save", function (next) {
    const product = this;
    const title = product.title;

    const slug = slugify(title, { lower: true });

    product.slug = slug;

    next();
});

module.exports = mongoose.model("Product", ProductsSchema);
