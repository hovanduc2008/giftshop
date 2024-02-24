const Product = require("../model/Product");

const { paginate } = require("../config/common");

const getAllProducts = async (req, res) => {
    const Products = await Product.find();
    if (!Products) return res.status(204).json({ message: "No Products found." });
    res.json(Products);
};

const createNewProduct = async (req, res) => {
    if (!req?.body?.title || !req?.body?.price) {
        return res.status(400).json({ message: "title and price are required" });
    }

    try {
        const result = await Product.create({
            user_id: req.user_id,
            title: req.body.title,
            country: req.body.country,
            website: req.body.website,
            content: req.body.content,
            price: req.body.price,
            discount: req.body.discount,
            description: req.body.description,
            image: req.body.image,
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

const updateProduct = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    const product = await Product.findOne({ _id: req.body.id }).exec();
    if (!product) {
        return res.status(204).json({ message: `No Product matches ID ${req.body.id}.` });
    }
    if (req.body?.title) product.title = req.body.title;
    if (req.body?.description) product.description = req.body.description;
    if (req.body?.image) product.image = req.body.image;
    if (req.body?.content) product.content = req.body.content;
    if (req.body?.price) product.price = req.body.price;
    if (req.body?.country) product.country = req.body.country;
    if (req.body?.website) product.website = req.body.website;
    if (req.body?.discount) product.discount = req.body.discount;
    const result = await product.save();
    res.json(result);
};

const deleteProduct = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ message: "Product ID required." });

    const product = await Product.findOne({ _id: req.body.id }).exec();
    if (!product) {
        return res.status(204).json({ message: `No Product matches ID ${req.body.id}.` });
    }
    const result = await product.deleteOne();
    res.json(result);
};

const getProduct = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ message: "Product ID required." });

    const product = await Product.findOne({ _id: req.params.id }).exec();
    if (!product) {
        return res.status(204).json({ message: `No Product matches ID ${req.params.id}.` });
    }
    res.json(product);
};

const searchProduct = async (req, res) => {
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
        const products = await paginate(
            Product,
            {
                search: queryConditions,
                sort: queryParams.sort,
            },
            page,
            perPage,
        );
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
        }
        return res.status(200).json(products);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "ID không hợp lệ." });
        }
        console.error("Error searching products:", error);
        return res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm sản phẩm." });
    }
};

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    searchProduct,
};
