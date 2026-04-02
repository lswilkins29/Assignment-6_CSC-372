"use strict";

const randomSetup = document.getElementById("random-setup");
const randomDelivery = document.getElementById("random-delivery");
const randomRefresh = document.getElementById("random-refresh");
const categoriesList = document.getElementById("categories-list");
const searchForm = document.getElementById("search-form");
const searchCategory = document.getElementById("search-category");
const jokesTitle = document.getElementById("jokes-title");
const jokesList = document.getElementById("jokes-list");
const addJokeForm = document.getElementById("add-joke-form");
const addResponse = document.getElementById("add-response");

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }
  return response.json();
}

async function loadRandomJoke() {
  try {
    const joke = await fetchJson("/jokebook/random");
    randomSetup.textContent = joke.setup;
    randomDelivery.textContent = joke.delivery;
  } catch (error) {
    randomSetup.textContent = "Unable to load a random joke.";
    randomDelivery.textContent = error.message;
  }
}

function renderCategoryButtons(categories) {
  categoriesList.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    button.className = "category-button";
    button.addEventListener("click", () => loadJokes(category));
    categoriesList.appendChild(button);
  });
}

async function loadCategories() {
  try {
    const categories = await fetchJson("/jokebook/categories");
    renderCategoryButtons(categories);
  } catch (error) {
    categoriesList.textContent = "Unable to load categories.";
  }
}

function renderJokes(category, jokes) {
  jokesTitle.textContent = `Jokes in '${category}'`;
  jokesList.innerHTML = "";
  if (!jokes.length) {
    jokesList.innerHTML = `<p class="info-text">No jokes found for this category yet.</p>`;
    return;
  }
  jokes.forEach((joke) => {
    const card = document.createElement("div");
    card.className = "joke-card";
    card.innerHTML = `
      <p class="joke-setup">${joke.setup}</p>
      <p class="joke-delivery">${joke.delivery}</p>
    `;
    jokesList.appendChild(card);
  });
}

async function loadJokes(category) {
  try {
    const jokes = await fetchJson(`/jokebook/category/${encodeURIComponent(category)}`);
    renderJokes(category, jokes);
  } catch (error) {
    jokesTitle.textContent = "Category not found";
    jokesList.innerHTML = `<p class="error-text">${error.message}</p>`;
  }
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const category = searchCategory.value.trim();
  if (!category) {
    return;
  }
  await loadJokes(category);
});

addJokeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  addResponse.textContent = "";

  const formData = new FormData(addJokeForm);
  const payload = {
    category: formData.get("category"),
    setup: formData.get("setup"),
    delivery: formData.get("delivery"),
  };

  try {
    const jokes = await fetchJson("/jokebook/joke/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    addResponse.textContent = "Joke added successfully.";
    addResponse.className = "response success";
    renderJokes(payload.category, jokes);
    await loadCategories();
    addJokeForm.reset();
  } catch (error) {
    addResponse.textContent = error.message;
    addResponse.className = "response error";
  }
});

randomRefresh.addEventListener("click", loadRandomJoke);

window.addEventListener("DOMContentLoaded", async () => {
  await loadRandomJoke();
  await loadCategories();
});
