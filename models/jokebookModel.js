"use strict";
const pool = require("./db");

const seedData = {
  funnyJoke: [
    {
      setup: "Why did the student eat his homework?",
      delivery: "Because the teacher told him it was a piece of cake!",
    },
    {
      setup: "What kind of tree fits in your hand?",
      delivery: "A palm tree",
    },
    {
      setup: "What is worse than raining cats and dogs?",
      delivery: "Hailing taxis",
    },
  ],
  lameJoke: [
    {
      setup: "Which bear is the most condescending?",
      delivery: "Pan-DUH",
    },
    {
      setup: "What would the Terminator be called in his retirement?",
      delivery: "The Exterminator",
    },
  ],
};

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS jokes (
        id SERIAL PRIMARY KEY,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        setup TEXT NOT NULL,
        delivery TEXT NOT NULL
      );
    `);

    const categoryCheck = await client.query("SELECT 1 FROM categories LIMIT 1");
    if (categoryCheck.rowCount === 0) {
      const categoryNames = Object.keys(seedData);
      for (const name of categoryNames) {
        await client.query("INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", [name]);
      }
    }

    const jokeCheck = await client.query("SELECT 1 FROM jokes LIMIT 1");
    if (jokeCheck.rowCount === 0) {
      for (const categoryName of Object.keys(seedData)) {
        const categoryResult = await client.query(
          "SELECT id FROM categories WHERE LOWER(name) = LOWER($1) LIMIT 1",
          [categoryName]
        );
        const categoryId = categoryResult.rows[0].id;
        for (const joke of seedData[categoryName]) {
          await client.query(
            "INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3)",
            [categoryId, joke.setup, joke.delivery]
          );
        }
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getCategories() {
  const result = await pool.query("SELECT name FROM categories ORDER BY name");
  return result.rows;
}

async function getJokesByCategory(category, limit) {
  const categoryResult = await pool.query(
    "SELECT id FROM categories WHERE LOWER(name) = LOWER($1) LIMIT 1",
    [category]
  );
  if (categoryResult.rowCount === 0) {
    return null;
  }

  const categoryId = categoryResult.rows[0].id;
  let query = `
    SELECT j.id, c.name AS category, j.setup, j.delivery
    FROM jokes j
    JOIN categories c ON j.category_id = c.id
    WHERE j.category_id = $1
    ORDER BY j.id
  `;
  const params = [categoryId];

  if (limit && Number.isInteger(limit) && limit > 0) {
    query += " LIMIT $2";
    params.push(limit);
  }

  const result = await pool.query(query, params);
  return result.rows;
}

async function getRandomJoke() {
  const result = await pool.query(`
    SELECT j.id, c.name AS category, j.setup, j.delivery
    FROM jokes j
    JOIN categories c ON j.category_id = c.id
    ORDER BY RANDOM()
    LIMIT 1
  `);
  return result.rows[0] || null;
}

async function addJoke(category, setup, delivery) {
  const cleanCategory = category.trim();
  const cleanSetup = setup.trim();
  const cleanDelivery = delivery.trim();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let categoryResult = await client.query(
      "SELECT id FROM categories WHERE LOWER(name) = LOWER($1) LIMIT 1",
      [cleanCategory]
    );

    let categoryId;
    if (categoryResult.rowCount === 0) {
      const insertCategory = await client.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
        [cleanCategory]
      );
      categoryId = insertCategory.rows[0].id;
    } else {
      categoryId = categoryResult.rows[0].id;
    }

    await client.query(
      "INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3)",
      [categoryId, cleanSetup, cleanDelivery]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getJokesByCategory(cleanCategory);
}

module.exports = {
  initializeDatabase,
  getCategories,
  getJokesByCategory,
  getRandomJoke,
  addJoke,
};
