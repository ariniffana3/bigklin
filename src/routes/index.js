const express = require("express");

const Router = express.Router();
const controller = require("./controller");
const middleware = require("../autentikasi/auth");

Router.post("/login", controller.login);
Router.post("/register", controller.register);
Router.get("/order", middleware.authentication, controller.getOrder);
Router.post("/order", middleware.authentication, controller.postOrder);
Router.delete("/order/:id", middleware.authentication, controller.deleteOrder);

module.exports = Router;
