const express = require("express");
const { createOrder, getCurrentOrders, completeOrder } = require("../controllers/Order");
const {auth} = require("../middleware/auth")
const router = express.Router();

router.post("/addOrder", auth, createOrder);
router.get("/getCurrentOrders", getCurrentOrders)
router.post("/completeOrder", completeOrder)

module.exports = router