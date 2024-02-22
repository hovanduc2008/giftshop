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

module.exports = mongoose.model("Calendar", CalendarsSchema);
