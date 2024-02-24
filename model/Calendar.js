const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CalendarsSchema = new Schema(
    {
        user_id: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        noti_date: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
        },
    },
    {
        timestamps: true,
    },
);

CalendarsSchema.pre("save", function (next) {
    const calendar = this;
    const title = calendar.title;

    const slug = slugify(title, { lower: true });

    calendar.slug = slug;

    next();
});

module.exports = mongoose.model("Calendar", CalendarsSchema);
