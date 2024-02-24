const express = require("express");
const router = express.Router();
const orderDetailController = require("../../controllers/orderDetailController");
//const verifyJWT = require('../../middleware/verifyJWT');
const ROLES_LIST = require("../../config/roles_list");

const verifyRoles = require("../../middleware/verifyRoles");

router
    .route("/:order_id")
    .get(orderDetailController.getAllOrderDetails)
    .post(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editer),
        orderDetailController.createNewOrderDetail,
    )
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editer), orderDetailController.updateOrderDetail)
    .delete(verifyRoles(ROLES_LIST.Admin), orderDetailController.deleteOrderDetail);

router.route("/:order_id/byid/:id").get(orderDetailController.getOrderDetail);

module.exports = router;
