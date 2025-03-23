const express = require("express");
const { addNewDish, getDish, getDishDetails } = require("../controllers/DishMenu");
const {auth} = require("../middleware/auth")
const router = express.Router();

router.post("/addNewDish", auth, addNewDish);
router.get("/getDish", getDish);
router.get("/getDishDetails", getDishDetails)


module.exports = router