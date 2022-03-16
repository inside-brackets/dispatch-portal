const express = require("express");
const route = express.Router();
const notifications = require("../controllers/notifications");

route.post("/",notifications.addNewNoti );
route.get("/",notifications.getNotis );
route.get('/:id',notifications.getNoti)
route.put("/:id",notifications.updateNoti)
route.delete('/:id',notifications.deleteNoti)

module.exports = route;
