const OrderDetail = require("../model/OrderDetail");
const Order = require("../model/Order");
const Product = require("../model/Product");

const getAllOrderDetails = async (req, res) => {
    if (!req?.params?.order_id) return res.status(400).json({ message: "Order ID required." });
    const OrderDetails = await OrderDetail.find({ order_id: req.params.order_id });
    if (!OrderDetails) return res.status(204).json({ message: "No OrderDetails found." });
    res.json(OrderDetails);
};

const createNewOrderDetail = async (req, res) => {
    if (!req?.params?.order_id || !req?.body?.item_list) {
        return res.status(400).json({ message: "order id and item list are required" });
    }

    const order = await Order.findOne({ _id: req.params.order_id }).exec();

    if (!order) {
        return res.status(204).json({ message: `No order matches ID ${req.params.order_id}.` });
    }

    if (order.user_id !== req.user_id) {
        return res.status(401).json({ message: `User is Unauthorized` });
    }

    var total_amount = 0;

    if (req.body.item_list.length > 0) {
        try {
            const new_list = await Promise.all(
                req.body.item_list.map(async function (item) {
                    const product = await Product.findOne({ _id: item._id }).exec();
                    if (product) {
                        item.discount = product.discount;
                        item.price = product.price;
                    } else {
                        item.discount = 10;
                        item.price = 1000;
                    }
                    item.order_id = req.params.order_id;
                    item.total_price =
                        item.quantity * (item.price - (item.discount * item.price) / 100);

                    total_amount += item.total_price;
                    return item;
                }),
            );

            const result = await OrderDetail.insertMany(new_list);

            order.total_amount = total_amount;
            await order.save();

            return res.status(200).json(result);
        } catch (error) {
            console.error(error); // Log any errors that occur during insertion
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } else {
        return res.status(204).json({ message: `Item list is empty` });
    }
};

const updateOrderDetail = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    const OrderDetail = await OrderDetail.findOne({ _id: req.body.id }).exec();
    if (!OrderDetail) {
        return res.status(204).json({ message: `No OrderDetail matches ID ${req.body.id}.` });
    }
    if (req.body?.OrderDetail_status) OrderDetail.OrderDetail_status = req.body.OrderDetail_status;
    const result = await OrderDetail.save();
    res.json(result);
};

const deleteOrderDetail = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ message: "OrderDetail ID required." });

    const OrderDetail = await OrderDetail.findOne({ _id: req.body.id }).exec();
    if (!OrderDetail) {
        return res.status(204).json({ message: `No OrderDetail matches ID ${req.body.id}.` });
    }
    const result = await OrderDetail.deleteOne();
    res.json(result);
};

const getOrderDetail = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ message: "OrderDetail ID required." });

    const OrderDetail = await OrderDetail.findOne({ _id: req.params.id }).exec();
    if (!OrderDetail) {
        return res.status(204).json({ message: `No OrderDetail matches ID ${req.params.id}.` });
    }
    res.json(OrderDetail);
};

module.exports = {
    getAllOrderDetails,
    createNewOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
    getOrderDetail,
};
