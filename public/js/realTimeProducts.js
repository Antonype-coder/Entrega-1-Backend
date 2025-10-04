const socket = io();

socket.on("productAdded", (product) => {
    const productsList = document.getElementById("productsList");
    
    const productHTML = `
        <div class="card mb-2" id="product-${product.id}">
            <div class="card-body d-flex justify-content-between">
                <div>
                    <h6 class="card-title">${product.title}</h6>
                    <p class="card-text mb-0">$${product.price} | Stock: ${product.stock}</p>
                    <small class="text-muted">${product.category}</small>
                </div>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
        </div>
    `;
    
    productsList.innerHTML += productHTML;
});

socket.on("productDeleted", (productId) => {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
        productElement.remove();
    }
});

socket.on("error", (error) => {
    alert('Error: ' + error.message);
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
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        socket.emit("deleteProduct", id);
    }
}