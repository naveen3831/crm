const express = require("express");
const uploadController = require("./upload.controller");

const router = express.Router();

router.get("/status", uploadController.getStatus);
router.post("/image", uploadController.uploadImage);

module.exports = router;
