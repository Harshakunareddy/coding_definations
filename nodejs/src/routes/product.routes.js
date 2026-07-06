const express = require('express');
const router = express.Router();


const controller = require('../controllers/product.controller');

router.post('/post', controller.CreateProductApi);
router.get('/get-all', controller.GetAll);

module.exports = router;