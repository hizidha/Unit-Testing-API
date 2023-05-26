var express = require("express");
var member = express.Router();

//import Controller
const MemberController = require("../controller/MemberController");

member.get("/member/profile", MemberController.getProfile);
member.get("/member/items", MemberController.getItems);
member.get("/member/items/:id", MemberController.getItemId);
member.get("/member/items/sta/:status", MemberController.getItemStatus);
member.post("/member/items", MemberController.storeItem);

module.exports = member;
