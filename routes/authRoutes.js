const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

//Routes
router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);
router.route('/logout').get(authController.logout_get);

module.exports = router;