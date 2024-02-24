const Category = require("../model/Category");
const { paginate } = require("../config/common");

const getAllCategories = async (req, res) => {
    const categories = await Category.find();
    if (!categories) return res.status(204).json({ message: "No categories found." });
    res.json(categories);
};

const createNewCategory = async (req, res) => {
    if (!req?.body?.title) {
        return res.status(400).json({ message: "title is required" });
    }

    try {
        const result = await Category.create({
            user_id: req.user_id,
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

const updateCategory = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    const category = await Category.findOne({ _id: req.body.id }).exec();
    if (!category) {
        return res.status(204).json({ message: `No category matches ID ${req.body.id}.` });
    }
    if (req.body?.title) category.title = req.body.title;
    if (req.body?.description) category.description = req.body.description;
    if (req.body?.image) category.image = req.body.image;
    const result = await category.save();
    res.json(result);
};

const deleteCategory = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ message: "Category ID required." });

    const category = await Category.findOne({ _id: req.body.id }).exec();
    if (!category) {
        return res.status(204).json({ message: `No Category matches ID ${req.body.id}.` });
    }
    const result = await Category.deleteOne();
    res.json(result);
};

const getCategory = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ message: "Category ID required." });

    const category = await Category.findOne({ _id: req.params.id }).exec();
    if (!category) {
        return res.status(204).json({ message: `No Category matches ID ${req.params.id}.` });
    }
    res.json(category);
};

const searchCategories = async (req, res) => {
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
        const categories = await paginate(
            Category,
            {
                search: queryConditions,
                sort: queryParams.sort,
            },
            page,
            perPage,
        );
        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy danh mục." });
        }
        return res.status(200).json(categories);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "ID không hợp lệ." });
        }
        console.error("Error searching products:", error);
        return res.status(500).json({ message: "Đã xảy ra lỗi khi tìm kiếm danh mục." });
    }
};

module.exports = {
    getAllCategories,
    createNewCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    searchCategories,
};
