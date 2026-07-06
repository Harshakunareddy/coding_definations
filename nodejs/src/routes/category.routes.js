const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');

const controller = require('../controllers/category.controller');

router.post('/post', upload.single('image'), controller.CreateCategoryApi);
router.get('/get-all', controller.GetAll);
router.get('/get-by-brand/:brandId', controller.GetByBrandId);

module.exports = router;