"use strict";
const express = require("express");
const router = express.Router();
const {
  getCategoryList,
  getJokesForCategory,
  getRandomJokeHandler,
  createJokeHandler,
} = require("../controllers/jokebookController");

router.get("/categories", getCategoryList);
router.get("/category/:category", getJokesForCategory);
router.get("/random", getRandomJokeHandler);
router.post("/joke/add", createJokeHandler);

module.exports = router;
