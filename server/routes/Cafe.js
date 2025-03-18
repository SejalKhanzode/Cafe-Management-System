const express = require('express');
const router = express.Router();

const { registerCafe, getAllCafes, getCafeDetails } = require('../controllers/Cafe');
const {auth} = require("../middleware/auth")

router.post("/registerCafe",auth , registerCafe)
router.get("/getcafes", getAllCafes)
router.get('/getCafeDetails', getCafeDetails )

module.exports = router