const express = require("express");
const router = express.Router();

const { upload } = require("../../middleware/multer");

const { uploadImage } = require("../../controllers/imageController");

router.post("/upload", upload.array("files[]"), uploadImage);

module.exports = router;
