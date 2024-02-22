const Category = require("../model/Category");

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

module.exports = {
    getAllCategories,
    createNewCategory,
    updateCategory,
    deleteCategory,
    getCategory,
};
