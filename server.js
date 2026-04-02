"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const jokebookRoutes = require("./routes/jokebookRoutes");
const { initializeDatabase } = require("./models/jokebookModel");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/jokebook", jokebookRoutes);

const PORT = process.env.PORT || 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}!`);
    });
  })
  .catch((error) => {
    console.error("Unable to initialize the database:", error);
    process.exit(1);
  });