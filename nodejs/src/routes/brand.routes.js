const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');

const controller = require('../controllers/brand.controller');

router.post('/post', upload.single('image'), controller.CreateBrandApi);
router.get('/get-all', controller.GetAll);

module.exports = router;