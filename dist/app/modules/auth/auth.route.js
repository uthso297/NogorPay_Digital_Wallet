"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const chekAuth_1 = require("../../middlewars/chekAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send('auth route');
});
router.post('/login', auth_controller_1.AuthController.credentialsLogin);
router.get('/me', (0, chekAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthController.getMe);
router.get('/logout', auth_controller_1.AuthController.logout);
exports.AuthRoutes = router;
