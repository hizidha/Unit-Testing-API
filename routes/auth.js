var express = require("express");
var router = express.Router();

//import Controller
const AuthController = require("../controller/AuthController");

router.post("/", AuthController.login);

module.exports = router;
