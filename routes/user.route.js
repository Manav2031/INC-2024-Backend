// Has all api
const router = require('express').Router();
const UserController = require('../controller/user.controller.js');
router.post('/registration',UserController.register);
router.post('/login',UserController.login);
module.exports = router;