const mongoose = require("mongoose");

const CafeSchema = new mongoose.Schema({
  cafeName: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  rating: {
    type: mongoose.Types.Decimal128,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dishes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

module.exports = mongoose.model("Caffe", CafeSchema);
