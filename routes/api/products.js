const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
//const verifyJWT = require('../../middleware/verifyJWT');
const ROLES_LIST = require("../../config/roles_list");

const verifyRoles = require("../../middleware/verifyRoles");

router
    .route("/")
    .get(productController.getAllProducts)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editer), productController.createNewProduct)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editer), productController.updateProduct)
    .delete(verifyRoles(ROLES_LIST.Admin), productController.deleteProduct);

router.route("byid/:id").get(productController.getProduct);
router.route("/search").get(productController.searchProduct);

module.exports = router;
