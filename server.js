const express = require("express");
const app = express();
const PORT = 8000;
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { DB_HOST, DB_PORT, DB_NAME } = process.env;

//LOCAL DB CONNECTION
// mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

//ONLINE DB CONNECTION
mongoose.connect(
  "mongodb://mongo:vvXWTV5hECKm6vRsi7IW@containers-us-west-128.railway.app:6221/test"
);

app.use(cors());
app.use(express.json());
app.use("/users", require("./api/users"));
app.use("/products", require("./api/products"));
app.use("/carts", require("./api/carts"));
app.use("/orders", require("./api/orders"));

app.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));
