const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');


router.post('/signup', UserController.signupApi);
router.post('/signup/admin', UserController.signupApiAdmin);

router.post('/login', UserController.loginApi);


module.exports = router;
