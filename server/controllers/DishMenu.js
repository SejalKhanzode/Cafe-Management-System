const Cafe = require("../models/Cafe");
const Dish = require("../models/Dish");
const Order = require("../models/Order")
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.addNewDish = async (req, res) => {
  try {
    const { dishName, cafeId, isVeg, category, desc, price } = req.body;
    const dishThumbnail = req.files.dishThumbnail;

    if (
      !dishName ||
      !dishThumbnail ||
      !isVeg ||
      !cafeId ||
      !category ||
      !desc ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const dishThumbnailImage = await uploadImageToCloudinary(
      dishThumbnail,
      process.env.FOLDER_NAME
    );

    console.log("dishThumbnailImage>>", dishThumbnailImage);

    let cafeDetails = await Cafe.findById(cafeId);
    console.log("cafeDetails>>", cafeDetails);

    if (!cafeDetails) {
      return res.status(404).json({
        success: false,
        message: "Cafe not found",
      });
    }

    const existingDish = await Dish.findOne({ dishName, cafeId });
    if (existingDish) {
      return res.status(409).json({
        success: false,
        message: "Dish already exists for this cafe",
      });
    }

    const newDish = await Dish.create({
      dishName,
      isVeg,
      desc,
      category,
      price,
      cafe: cafeId,
      dishThumbnail: dishThumbnailImage.secure_url,
    });

    const updatedCafe = await Cafe.findByIdAndUpdate(
      cafeId,
      { $push: { dishes: newDish._id } },
      { new: true }
    ).populate("dishes");

    return res.status(201).json({
      success: true,
      message: "Dish added to cafe successfully",
      updatedCafe,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in adding new dish to menu",
    });
  }
};

exports.getDish = async (req, res) => {
  try {
    const { dishId } = req.body;
    const dishDetails = await Dish.findById(dishId);
    console.log("dishDetails>>", dishDetails);
    if (!dishDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the dish with ${dishId}`,
      });
    }
    res.status(200).json({
      success: true,
      message: "Dish details fetched successfully",
      dishDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Fetching error in getting dish details ",
    });
  }
};

exports.getDishDetails = async(req, res)=>{
  try{
    const {cafeId} = req.body;
    const cafe = await Cafe.findById(cafeId);
console.log("cafe>>", cafe)
    if(!cafe){
      res.status(401).json({
        success:false,
        message:'Cafe not found'
      })
    }
  
    const dishesId = cafe.dishes
    const ordersId = cafe.orders

    const dishes = []
    const orders = []

    const dishStats = {}

    

        const stats = { today: [], Days15: [], Weeks4: [], Weeks24: [], Weeks52: [] }; // Order statistics based on timeframes
        const MonthlyOrderStats = {}; // Stores order count per month

        // Fetch all dishes in a single database query to improve performance
        // const dishes = await Dish.find({ _id: { $in: dishesId } });

        // Initialize dishStats for each dish
        for (let i = 0; i < dishesId.length; i++) {
          const newDish = await Dish.findById(dishesId[i])
          dishes.push(newDish)
          dishStats[newDish.dishName] = [{ today: 0 }, { Days15: 0 }, { Weeks4: 0 }, { Weeks24: 0 }, { Weeks52: 0 },]
  
      }

        // Fetch all orders in a single query to reduce database calls
        // const orders = await Order.find({ _id: { $in: ordersId } });

         // Process orders to calculate statistics
         orders.forEach(order => {
          const orderDate = new Date(getCorrectDateFormat(order.date));

          if (orderDate.toISOString() === new Date(getXDays()).toISOString()) {
              stats.today.push(order);
          }
          if (orderDate >= new Date(getXDays(15))) {
              stats.Days15.push(order);
          }
          if (orderDate >= new Date(getXDays(28))) {
              stats.Weeks4.push(order);
          }
          if (orderDate >= new Date(getXDays(168))) {
              stats.Weeks24.push(order);
          }
          if (orderDate >= new Date(getXDays(364))) {
              stats.Weeks52.push(order);
          }
      });

      // Calculate dish sales count within different timeframes
      

    for (const key in stats) {

      (stats[key]).forEach((ele) => {
          (ele.data).forEach((dish) => {
              (dishStats[dish.name]).forEach((e) => {
                  for (const dishkey in e) {
                      if (dishkey === key) {
                          e[dishkey] = e[dishkey] + dish.qty
                      }
                  }
              })
          })
      })

  };

    // Calculate monthly order statistics from past 4 weeks
    stats['Weeks4'].forEach((ord) => {

      if (MonthlyOrderStats[ord.date]) {
          MonthlyOrderStats[ord.date] = MonthlyOrderStats[ord.date] + 1
      }
      else {
          MonthlyOrderStats[ord.date] = 1
      }

  })

  res.status(200).json({
    success:true,
    message:"Dish Details fetched successfully ",
    cafeName : cafe.cafeName , dishStats , MonthlyOrderStats   })


  }catch(error){
    console.log(error);
    res.status(400).json({
      success:false,
      message:'Error in fetchong dish details'
    })
  }
}
