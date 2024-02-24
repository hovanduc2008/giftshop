const Calendar = require("../model/Calendar");

const { paginate } = require("../config/common");

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

const searchCalendars = async (req, res) => {
    try {
        const queryParams = req.query;
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perpage) || 10;
        const queryConditions = {};
        if (queryParams.q) {
            queryConditions.$or = [
                { title: { $regex: queryParams.q, $options: "i" } },
                { slug: { $regex: queryParams.q, $options: "i" } },
            ];
        }
        const calendars = await paginate(
            Calendar,
            {
                search: queryConditions,
                sort: queryParams.sort,
            },
            page,
            perPage,
        );
        if (!calendars || calendars.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy lịch." });
        }
        return res.status(200).json(calendars);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "ID không hợp lệ." });
        }
        console.error("Error searching products:", error);
        return res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm lịch." });
    }
};

module.exports = {
    getAllCalendars,
    createNewCalendar,
    updateCalendar,
    deleteCalendar,
    getCalendar,
    searchCalendars,
};
