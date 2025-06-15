const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const path = require("path");
const cors = require("cors");



dotEnv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/vendor", vendorRoutes);

app.use("/firm", firmRoutes);

app.use("/product", productRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/satya", (req, res) => {
  res.send("satya path your seeing");
});

app.get("/", (req, res) => {
  res.send("welcome to Home Page");
});

app.get("/login", (req, res) => {
  console.log("helo how r u ");
});

app.listen(PORT, () => {
  console.log("server started at 4000 port");
});
