const express = require("express");
const app = express();

const userRoutes = require("./routes/User");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const {cloudinaryConnect } = require("./config/cloudinary");
// const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
database.connect();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})
