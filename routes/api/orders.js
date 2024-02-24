const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/orderController");
//const verifyJWT = require('../../middleware/verifyJWT');
const ROLES_LIST = require("../../config/roles_list");

const verifyRoles = require("../../middleware/verifyRoles");

router
    .route("/")
    .get(orderController.getAllOrders)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editer), orderController.createNewOrder)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editer), orderController.updateOrder)
    .delete(verifyRoles(ROLES_LIST.Admin), orderController.deleteOrder);

router.route("/byid/:id").get(orderController.getOrder);
router.route("/search").get(orderController.searchOrders);

module.exports = router;
