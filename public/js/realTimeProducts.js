const socket = io();

socket.on("productsUpdated", (products) => {
    const productsList = document.getElementById("productsList");
    
    if (products.length === 0) {
        productsList.innerHTML = '<p class="text-muted">No hay productos</p>';
        return;
    }
    
    let html = '';
    products.forEach(product => {
        html += `
            <div class="card mb-2" id="product-${product.id}">
                <div class="card-body d-flex justify-content-between">
                    <div>
                        <h6 class="card-title">${product.title}</h6>
                        <p class="card-text mb-0">$${product.price} | Stock: ${product.stock}</p>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    productsList.innerHTML = html;
});

document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: parseFloat(formData.get("price")),
        stock: parseInt(formData.get("stock")),
        category: formData.get("category")
    };
    
    socket.emit("createProduct", productData);
    e.target.reset();
});

function deleteProduct(id) {
    if (confirm('¿Eliminar producto?')) {
        socket.emit("deleteProduct", id);
    }
}