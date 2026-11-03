# Mini Backend Project

This project is a simple backend API built with Node.js and Express.

## Features

- Get all products
- Get one product by ID
- Create a new product
- Update a product
- Delete a product

## Project Structure

- `server.js` – API server and CRUD logic
- `data/products.json` – simple JSON database

## Install

```bash
npm install
```

## Run

```bash
npm start
```

For development mode:

```bash
npm run dev
```

## API Routes

### GET `/`
Returns basic project info.

### GET `/api/products`
Returns all products.

### GET `/api/products/:id`
Returns one product by ID.

### POST `/api/products`
Create a new product.

Example body:

```json
{
  "name": "Keyboard",
  "price": 1490,
  "stock": 10
}
```

### PUT `/api/products/:id`
Update a product.

### DELETE `/api/products/:id`
Delete a product.

## Example Request

```bash
curl http://localhost:3000/api/products
```
