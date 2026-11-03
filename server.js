const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const dataFile = path.join(__dirname, 'data', 'products.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readProducts() {
  const fileData = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(fileData);
}

function writeProducts(products) {
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
}

function getNextId(products) {
  return products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({ message: 'Name, price, and stock are required' });
  }

  const products = readProducts();
  const newProduct = {
    id: getNextId(products),
    name,
    price: Number(price),
    stock: Number(stock)
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readProducts();
  const productIndex = products.findIndex((item) => item.id === Number(req.params.id));

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    id: Number(req.params.id)
  };

  products[productIndex] = updatedProduct;
  writeProducts(products);

  res.json(updatedProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const products = readProducts();
  const filteredProducts = products.filter((item) => item.id !== Number(req.params.id));

  if (filteredProducts.length === products.length) {
    return res.status(404).json({ message: 'Product not found' });
  }

  writeProducts(filteredProducts);
  res.json({ message: 'Product deleted successfully' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing process or run with PORT=3001.`);
    process.exit(1);
  }

  throw err;
});
