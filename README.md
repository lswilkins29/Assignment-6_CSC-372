# Assignment-6_CSC-372

## Getting Started
Video Demo: https://uncg-my.sharepoint.com/:v:/g/personal/lswilkins_uncg_edu/IQDmOsI4cXf2R44U8sVEvc8nATxWo-_099skDj4ZjtreyxQ?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=UydoRQ

### Starting the Server

To start the server, run the following command:

```bash
node server.js
```

The server will listen on port 3000 by default.

## API Endpoints

### GET /jokebook/categories
Retrieves a list of all available joke categories.

**Response:**
```json
["programming", "dad", "knock-knock"]
```

### GET /jokebook/category/:category
Retrieves all jokes for a specific category.

**Parameters:**
- `category` (path parameter): The name of the category
- `limit` (query parameter, optional): Maximum number of jokes to return

**Response:**
```json
[
  {
    "id": 1,
    "category": "programming",
    "setup": "Why did the developer go broke?",
    "delivery": "Because he used up all his cache!"
  }
]
```

### GET /jokebook/random
Retrieves a random joke from the database.

**Response:**
```json
{
  "id": 5,
  "category": "dad",
  "setup": "Why don't scientists trust atoms?",
  "delivery": "Because they make up everything!"
}
```

### POST /jokebook/joke/add
Adds a new joke to the database.

**Request Body:**
```json
{
  "category": "programming",
  "setup": "Why did the developer go broke?",
  "delivery": "Because he used up all his cache!"
}
```

**Response (201 Created):**
```json
{
  "id": 10,
  "category": "programming",
  "setup": "Why did the developer go broke?",
  "delivery": "Because he used up all his cache!"
}
```

