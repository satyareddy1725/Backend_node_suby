const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: [
      {
        type: String,
        enum: ["veg", "non-veg"],
      },
    ],
    required: true,
  },
  image: {
    type: String,
  },
  bestSeller: {
    type: Boolean,
  },
  description: {
    type: String,
  },
  firm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Firm",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
