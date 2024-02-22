const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const CategoriesSchema = new Schema(
    {
        user_id: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        slug: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

CategoriesSchema.pre("save", function (next) {
    const category = this;
    const title = category.title;

    const slug = slugify(title, { lower: true });

    category.slug = slug;

    next();
});

module.exports = mongoose.model("Category", CategoriesSchema);
