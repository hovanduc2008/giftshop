const Calendar = require("../model/Calendar");

const getAllCalendars = async (req, res) => {
    const Calendars = await Calendar.find();
    if (!Calendars) return res.status(204).json({ message: "No Calendars found." });
    res.json(Calendars);
};

const createNewCalendar = async (req, res) => {
    if (!req?.body?.title || !req?.body?.noti_date) {
        return res.status(400).json({ message: "title and noti date are required" });
    }

    try {
        const result = await Calendar.create({
            user_id: req.user_id,
            title: req.body.title,
            noti_date: req.body.title,
            description: req.body.description,
            status: req.body.status || "active",
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
};

const updateCalendar = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    const calendar = await Calendar.findOne({ _id: req.body.id }).exec();
    if (!calendar) {
        return res.status(204).json({ message: `No Calendar matches ID ${req.body.id}.` });
    }
    if (req.body?.title) calendar.title = req.body.title;
    if (req.body?.description) calendar.description = req.body.description;
    if (req.body?.noti_date) calendar.noti_date = req.body.noti_date;
    if (req.body?.status) calendar.status = req.body.status;
    const result = await calendar.save();
    res.json(result);
};

const deleteCalendar = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ message: "Calendar ID required." });

    const calendar = await Calendar.findOne({ _id: req.body.id }).exec();
    if (!calendar) {
        return res.status(204).json({ message: `No Calendar matches ID ${req.body.id}.` });
    }
    const result = await calendar.deleteOne(); //{ _id: req.body.id }
    res.json(result);
};

const getCalendar = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ message: "Calendar ID required." });

    const calendar = await Calendar.findOne({ _id: req.params.id }).exec();
    if (!calendar) {
        return res.status(204).json({ message: `No Calendar matches ID ${req.params.id}.` });
    }
    res.json(calendar);
};

module.exports = {
    getAllCalendars,
    createNewCalendar,
    updateCalendar,
    deleteCalendar,
    getCalendar,
};
