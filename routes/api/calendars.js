const express = require("express");
const router = express.Router();
const calendarController = require("../../controllers/calendarController");
//const verifyJWT = require('../../middleware/verifyJWT');
const ROLES_LIST = require("../../config/roles_list");

const verifyRoles = require("../../middleware/verifyRoles");

router
    .route("/")
    .get(calendarController.getAllCalendars)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editer), calendarController.createNewCalendar)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editer), calendarController.updateCalendar)
    .delete(verifyRoles(ROLES_LIST.Admin), calendarController.deleteCalendar);

router.route("/:id").get(calendarController.getCalendar);

module.exports = router;
