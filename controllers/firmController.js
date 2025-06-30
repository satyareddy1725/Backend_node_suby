const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
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

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : undefined;
    // console.log(image)

    const vendor = await Vendor.findById(req.vendorId);

    console.log(vendor);

    if (!vendor) {
      return res.status(404).json({ message: "vendor not found" });
    }

    if (vendor.firm.length > 0) {
      return res.status(400).json({ message: "vendor can have only one firm" });
    }

    const firm = new Firm({
      firmName,
      area,
      categories: category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    console.log(firm);

    const savedfirm = await firm.save();
    const firmId = savedfirm._id;
    const fName = savedfirm.firmName;
    vendor.firm.push(savedfirm);
    await vendor.save();

    return res
      .status(200)
      .json({ message: "Firm added successfully", firmId, fName });
  } catch (err) {
    console.error("Error adding firm:", err);
    res.status(500).json({ error: "internal server error" });
  }
};

const deleteFirmId = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if (!deletedFirm) {
      return res.status(404).json({ error: "No firm found" });
    }

    res.status(200).json({
      message: "Firm deleted successfully",
      firm: deletedFirm,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

module.exports = {
  addFirm: [upload.single("image"), addFirm],
  deleteFirmId,
};
