const express = require('express');
const BrandController = require("./BrandController");
const router = express.Router();

router.get("/", BrandController.getAll);

module.exports = router;