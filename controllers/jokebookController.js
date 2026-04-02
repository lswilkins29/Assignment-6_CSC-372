"use strict";
const {
  getCategories,
  getJokesByCategory,
  getRandomJoke,
  addJoke,
} = require("../models/jokebookModel");

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

async function getCategoryList(req, res) {
  try {
    const categories = await getCategories();
    res.json(categories.map((row) => row.name));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load categories." });
  }
}

async function getJokesForCategory(req, res) {
  try {
    const category = req.params.category;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const jokes = await getJokesByCategory(category, limit);
    if (jokes === null) {
      return badRequest(res, `Category '${category}' is not valid.`);
    }
    res.json(jokes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load jokes for that category." });
  }
}

async function getRandomJokeHandler(req, res) {
  try {
    const joke = await getRandomJoke();
    if (!joke) {
      return res.status(404).json({ error: "No jokes found in the database." });
    }
    res.json(joke);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load a random joke." });
  }
}

async function createJokeHandler(req, res) {
  try {
    const { category, setup, delivery } = req.body;
    if (!category || !setup || !delivery) {
      return badRequest(res, "Missing required fields: category, setup, and delivery are all required.");
    }

    const jokes = await addJoke(category, setup, delivery);
    res.status(201).json(jokes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to add the joke." });
  }
}

module.exports = {
  getCategoryList,
  getJokesForCategory,
  getRandomJokeHandler,
  createJokeHandler,
};
