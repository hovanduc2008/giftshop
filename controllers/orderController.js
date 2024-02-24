const Order = require("../model/Order");
const { paginate } = require("../config/common");

const getAllOrders = async (req, res) => {
    const Orders = await Order.find();
    if (!Orders) return res.status(204).json({ message: "No Orders found." });
    res.json(Orders);
};

const createNewOrder = async (req, res) => {
    if (!req?.body?.shipping_address || !req?.body?.phone_number || !req?.body?.email) {
        return res
            .status(400)
            .json({ message: "shipping address, phone number and email are required" });
    }

    console.log(req.body);

    try {
        const result = await Order.create({
            user_id: req.user_id,
            order_note: req.user_id,
            shipping_address: req.body.shipping_address,
            phone_number: req.body.phone_number,
            email: req.body.email,
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

const updateOrder = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    const order = await Order.findOne({ _id: req.body.id }).exec();
    if (!order) {
        return res.status(204).json({ message: `No Order matches ID ${req.body.id}.` });
    }
    if (req.body?.order_status) order.order_status = req.body.order_status;
    const result = await order.save();
    res.json(result);
};

const deleteOrder = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ message: "Order ID required." });

    const order = await Order.findOne({ _id: req.body.id }).exec();
    if (!order) {
        return res.status(204).json({ message: `No Order matches ID ${req.body.id}.` });
    }
    const result = await order.deleteOne();
    res.json(result);
};

const getOrder = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ message: "Order ID required." });

    const order = await Order.findOne({ _id: req.params.id }).exec();
    if (!order) {
        return res.status(204).json({ message: `No Order matches ID ${req.params.id}.` });
    }
    res.json(order);
};

const searchOrders = async (req, res) => {
    try {
        const queryParams = req.query;
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perpage) || 10;
        const queryConditions = {};
        if (queryParams.q) {
            queryConditions.$or = [
                { name: { $regex: queryParams.q, $options: "i" } },
                { slug: { $regex: queryParams.q, $options: "i" } },
            ];
        }
        const orders = await paginate(
            Order,
            {
                search: queryConditions,
                sort: queryParams.sort,
            },
            page,
            perPage,
        );
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
        }
        return res.status(200).json(orders);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "ID không hợp lệ." });
        }
        console.error("Error searching products:", error);
        return res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm đơn hàng." });
    }
};

module.exports = {
    getAllOrders,
    createNewOrder,
    updateOrder,
    deleteOrder,
    getOrder,
    searchOrders,
};
