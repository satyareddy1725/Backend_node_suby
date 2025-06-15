const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/add-product/:FirmId", productController.addProduct);
router.get("/:FirmId/products", productController.getProductsByFirm);
router.get("./uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.headersSent("content-type", "image/jpeg");
  res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});
router.delete("/:productId", productController.deleteProductById);

module.exports = router;
