const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const cafeRoutes = require("./routes/Cafe");
const menuRoutes = require("./routes/Dish");
const orderRoutes = require("./routes/Order")

const database = require("./config/database");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
database.connect();
app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", userRoutes);
app.use("/api/cafe", cafeRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes)

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})
