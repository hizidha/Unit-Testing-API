var express = require("express");
var admin = express.Router();

//import Controller
const AdminController = require("../controller/AdminController");
const ItemsController = require("../controller/ItemsController");

//Router admin untuk memanipulasi akun member
admin.get("/admin", AdminController.getMembers);
admin.post("/admin", AdminController.storeMember);
admin.put("/member/:id", AdminController.updateMember);
admin.delete("/member/:id", AdminController.deleteMember);

//Router admin untuk memanipulasi data Item Pengajuan
admin.get("/admin/items", ItemsController.getAllItems);
admin.get("/admin/items/:status", ItemsController.getItemStatus);
admin.patch("/admin/items/:id", ItemsController.updateStatus);

module.exports = admin;
