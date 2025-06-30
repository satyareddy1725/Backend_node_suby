const Vendor = require("../models/Vendor.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");

dotEnv.config();

const VendorRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({ username, email, password: hashedPassword });

    await newVendor.save();

    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const VendorLogin = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);

  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      res.status(401).json({ error: "Please enter valid details" });
    }
    const token = jwt.sign(
      { vendorId: vendor._id },
      process.env.WhatIsYourName,
      {
        expiresIn: "72h",
      }
    );

    const vendorId = vendor._id;

    res.status(200).json({
      success: "vendor fetched sucessfully",
      token: token,
      vendorId,
    });
    0;
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const allVendors = await Vendor.find().populate("firm");
    res.json({ allVendors });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const getVendorById = async (req, res) => {
  const vendorId = req.params.id;
  console.log(vendorId);
  try {
    const vendor = await Vendor.findById(vendorId).populate("firm");
    console.log(vendor);

    if (!vendor) {
      return res.status(400).json({ error: "Vendor Not Exist" });
    }
    const venderFirmId = vendor?.firm[0]?._id;
    if (!venderFirmId) {
      return res.status(400).json({ error: "firm Not Exist" });
    }

    res.status(200).json({ vendor, venderFirmId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { VendorRegister, VendorLogin, getAllVendors, getVendorById };
