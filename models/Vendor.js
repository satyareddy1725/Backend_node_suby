const mongoose = require("mongoose");

const { Schema } = mongoose;

const VendorSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firm: [
    {
      ref: "Firm",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports =  Vendor ;
