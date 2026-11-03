const productList = document.getElementById('productList');
const productForm = document.getElementById('productForm');
const refreshBtn = document.getElementById('refreshBtn');

const totalProducts = document.getElementById('totalProducts');
const totalStock = document.getElementById('totalStock');
const totalRevenue = document.getElementById('totalRevenue');

async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    renderProducts(products);
    updateSummary(products);
  } catch (error) {
    console.error('Failed to load products:', error);
    productList.innerHTML = '<div class="empty-state">Unable to load products.</div>';
  }
}

function updateSummary(products) {
  totalProducts.textContent = products.length;
  const stockTotal = products.reduce((sum, item) => sum + Number(item.stock || 0), 0);
  const revenueTotal = products.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0), 0);

  totalStock.textContent = stockTotal;
  totalRevenue.textContent = formatCurrency(revenueTotal);
}

function renderProducts(products) {
  if (!products.length) {
    productList.innerHTML = '<div class="empty-state">No products found.</div>';
    return;
  }

  productList.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <h3>${product.name}</h3>
          <p class="meta">Price: ${formatCurrency(product.price)}</p>
          <p class="meta">Stock: ${product.stock}</p>
          <div class="product-actions">
            <button class="secondary-btn" data-action="update" data-id="${product.id}">Edit</button>
            <button class="danger-btn" data-action="delete" data-id="${product.id}">Delete</button>
          </div>
        </article>
      `
    )
    .join('');
}

function formatCurrency(value) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(Number(value));
}

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    name: document.getElementById('name').value.trim(),
    price: Number(document.getElementById('price').value),
    stock: Number(document.getElementById('stock').value)
  };

  if (!payload.name || !payload.price || payload.stock === undefined || Number.isNaN(payload.stock)) {
    alert('Please enter valid product data.');
    return;
  }

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create product');
    }

    productForm.reset();
    loadProducts();
  } catch (error) {
    alert(error.message);
  }
});

productList.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === 'delete') {
    const confirmDelete = window.confirm('Delete this product?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  }

  if (action === 'update') {
    const product = (await fetch(`/api/products/${id}`).then((res) => res.json()));
    const name = window.prompt('Edit product name:', product.name);
    if (name === null) return;

    const price = window.prompt('Edit price:', String(product.price));
    if (price === null) return;

    const stock = window.prompt('Edit stock:', String(product.stock));
    if (stock === null) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          stock: Number(stock)
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  }
});

refreshBtn.addEventListener('click', loadProducts);

loadProducts();
