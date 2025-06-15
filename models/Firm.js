const mongoose = require("mongoose");

const { Schema } = mongoose;

const firmSchema = new Schema({
  firmName: {
    type: String,
    required: true,
    unique: true,
  },
  area: {
    type: String,
    required: true,
  },
  categories: {
    type: [{ type: String, enum: ["veg", "non-veg"] }],
  },
  region: {
    type: [
      {
        type: String,
        enum: ["south-indian", "north-indian", "chinese", "bakery"],
      },
    ],
  },
  offer: {
    type: String,
  },
  image: {
    type: String,
  },
  vendor: [
    {
      ref: "Vendor",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
  product: [
    {
      ref: "Product",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
});

const Firm = mongoose.model("Firm", firmSchema);

module.exports = Firm;
