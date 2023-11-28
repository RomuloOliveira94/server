require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 5000;

//config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log("server running at port " + port);
});

//db connection
require("./config/db.js");

//solve cors
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

//upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//routes import
const router = require("./routes/Router");
app.use(router);
