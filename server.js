"use strict";
const express = require("express");
const app = express();

const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//const productRoutes = require('./routes/productRoutes');
//const userRoutes = require('./routes/userRoutes');

//app.use('/products', productRoutes);
//app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server listening on port: " + PORT + "!");
});