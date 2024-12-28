const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./utils/connectDb");

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

// app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  connectDb();
  console.log(`Server is running on port ${port}`);
});
