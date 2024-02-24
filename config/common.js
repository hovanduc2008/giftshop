// pagination.js

/**
 * Hàm phân trang
 * @param {Model} model - Mongoose model
 * @param {Object} query - Các điều kiện truy vấn (nếu có)
 * @param {Number} page - Trang hiện tại
 * @param {Number} perPage - Số lượng bản ghi trên mỗi trang
 * @returns {Object} - Kết quả phân trang
 */

const paginate = async (model, query = {}, page = 1, perPage = 10, picker = []) => {
    const skip = (page - 1) * perPage;

    try {
        const sort = getSortCondition(query.sort);

        const totalRow = await model.countDocuments(query.search);
        const totalPages = Math.ceil(totalRow / perPage);
        const data = await model.find(query.search, picker).sort(sort).skip(skip).limit(perPage);

        return {
            perPage,
            currentPage: page,
            totalRow,
            totalPages,
            data: data,
        };
    } catch (error) {
        throw new Error("Lỗi khi thực hiện phân trang");
    }
};

const getSortCondition = function ($value) {
    switch ($value) {
        case "latest":
            return { createdAt: -1 };
        case "oldest":
            return { createdAt: 1 };
        case "price_asc":
            return { price: 1 };
        case "price_desc":
            return { price: -1 };
        case "a_z":
            return { title: 1 };
        case "z_a":
            return { title: -1 };
        default:
            return { createdAt: -1 };
    }
};

const picker = (fields) => {
    // Nếu mảng fields chứa dấu '*' thì trả về toàn bộ trường
    if (fields.includes("*")) {
        return {};
    }

    const projection = fields.reduce((acc, field) => {
        acc[field] = 1; // 1 nghĩa là lấy trường, 0 nghĩa là không lấy
        return acc;
    }, {});

    return projection;
};

module.exports = {
    paginate,
    picker,
};
