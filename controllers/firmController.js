const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path")


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
    const { firmName, area, categories, region, offer } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "vendor not found" });
    }

    const firm = new Firm({
      firmName,
      area,
      categories,
      region,
      offer,
      vendor: vendor._id,
    });

    const savedfirm = await firm.save();
    vendor.firm.push(savedfirm);
    await vendor.save();

    return res.status(200).json({ message: "Firm added successfully" });
  } catch (err) {
    res.status(501).json({ error: "internal server error" });
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
