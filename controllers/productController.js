const Product = require("../models/Product");
const Firm = require("../models/Firm");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // upload destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., image-123456.jpg
  },
});

const upload = multer({ storage: storage });

// 1. Add a new product
const addProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { productName, price, categories, bestseller, description } =
      req.body;

    const image = req.file ? req.file.filename : undefined;
    const firmId = req.params.FirmId;
    // console.log(firmId);

    // Check if the firm exists
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    // Create and save the new product
    const product = new Product({
      productName,
      price,
      category: categories,
      image,
      bestSeller: bestseller,
      description,
      firm: firmId, // store only the ID (reference)
    });
    console.log(product);

    const savedProduct = await product.save();

    firm.product.push(savedProduct);

    await firm.save();

    res.status(200).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProductsByFirm = async (req, res) => {
  try {
    const firmId = req.params.FirmId;

    // Validate if the firm exists
    const firm = await Firm.findById(firmId);
    const restaurentName = firm.firmName;

    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    // Fetch all products with the matching firm ID
    const products = await Product.find({ firm: firmId });

    res.status(200).json({ restaurentName, products });
  } catch (err) {
    console.error("Error fetching products by firm ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "No product found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductsByFirm,
  deleteProductById,
};
