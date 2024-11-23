$(document).ready(function() {
    // Lista de productos
    const products = [
        { id: 1, name: "Vino Tinto Clásico", description: "Un vino tinto con cuerpo, ideal para carnes rojas.", price: 15000, image: "./img/bianchi_vino.webp", rating: 4.5 },
        { id: 2, name: "Vino Tinto Fresco", description: "Fresco y frutal, perfecto para mariscos y pescados.", price: 12500, image: "./img/zuccardi-q-malbec-2021-vino-zuccardi-valle-de-uco-678638.webp", rating: 4.2 },
        { id: 3, name: "Vino Rosado Suave", description: "Suave y ligero, con notas de frutos rojos.", price: 11000, image: "./img/trivento-reserve-cabernet-sauvignon-2022-vino-trivento-508116.webp", rating: 4.0 },
        { id: 4, name: "Espumante Brut", description: "Elegante y refrescante, ideal para celebraciones especiales.", price: 25000, image: "./img/Vino-Wampa-Malbec-750-Bot-0-75-lt-Sin-Atributo-1-957382.webp", rating: 4.8 },
        { id: 5, name: "Vino Tinto Reserva", description: "Un vino intenso y maduro, perfecto para ocasiones especiales.", price: 28500, image: "./img/1.webp", rating: 4.7 },
        { id: 6, name: "Vino Tinto Dulce", description: "Dulce y aromático, ideal como vino de postre.", price: 10500, image: "./img/rutini_cabernet_malbec11-d38432232bca615bb716392359093559-1024-1024.jpeg", rating: 4.3 }
    ];

    // Carrito
    let cart = {};

    // Cargar productos en la página
    function loadProducts() {
        products.forEach(product => {
            $('#product-list').append(`
                <div class="col-md-4 mb-4">
                    <div class="card product-card" data-id="${product.id}">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-price"><strong>$${product.price}</strong></p>
                            <button class="btn btn-primary btn-add-to-cart" data-id="${product.id}">Comprar</button>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Mostrar detalle del producto
    function showProductDetail(product) {
        // Crear modal con detalles del producto
        const modalHTML = `
            <div class="modal fade" id="productModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${product.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${product.image}" class="img-fluid" alt="${product.name}">
                                </div>
                                <div class="col-md-6">
                                    <h4>Descripción</h4>
                                    <p>${product.description}</p>
                                    <div class="mb-3">
                                        <h4>Valoración</h4>
                                        <div class="stars">
                                            ${getStarRating(product.rating)}
                                        </div>
                                        <span class="rating-number">${product.rating}/5</span>
                                    </div>
                                    <h4>Precio</h4>
                                    <p class="h3">$${product.price}</p>
                                    <button class="btn btn-primary modal-btn-add-to-cart" data-id="${product.id}" data-bs-dismiss="modal">
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal anterior si existe
        $('#productModal').remove();
        
        // Agregar nuevo modal y mostrarlo
        $('body').append(modalHTML);
        $('#productModal').modal('show');
    }

    // Función para generar estrellas de valoración
    function getStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star text-warning"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt text-warning"></i>';
            } else {
                stars += '<i class="far fa-star text-warning"></i>';
            }
        }
        return stars;
    }

    // Actualizar el carrito
    function updateCart() {
        $('#cart-table').empty();
        let total = 0;
        for (let id in cart) {
            const item = cart[id];
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            $('#cart-table').append(`
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary btn-decrease" data-id="${id}">-</button>
                        ${item.quantity}
                        <button class="btn btn-sm btn-secondary btn-increase" data-id="${id}">+</button>
                    </td>
                    <td>$${itemTotal}</td>
                    <td><button class="btn btn-sm btn-danger btn-remove" data-id="${id}">Eliminar</button></td>
                </tr>
            `);
        }
        $('#cart-total').text(total);
        
        if (Object.keys(cart).length > 0) {
            if ($('#btn-pay').length === 0) {
                $('#cart-items').append(`
                    <div class="text-end mt-3">
                        <button id="btn-pay" class="btn btn-success">Pagar ahora</button>
                    </div>
                `);
            }
        } else {
            $('#btn-pay').remove();
        }
    }

    // Click en la tarjeta del producto
    $('#product-list').on('click', '.product-card', function(e) {
        // Evitar que se abra el modal si se hace click en el botón de comprar
        if (!$(e.target).hasClass('btn-add-to-cart')) {
            const id = $(this).data('id');
            const product = products.find(p => p.id === id);
            showProductDetail(product);
        }
    });

    // Eventos de botones en productos
    $('#product-list').on('click', '.btn-add-to-cart', function() {
        const id = $(this).data('id');
        const product = products.find(p => p.id === id);

        if (cart[id]) {
            cart[id].quantity++;
        } else {
            cart[id] = { ...product, quantity: 1 };
        }
        updateCart();
    });

    // Evento para agregar al carrito desde el modal
    $(document).on('click', '.modal-btn-add-to-cart', function() {
        const id = $(this).data('id');
        const product = products.find(p => p.id === id);

        if (cart[id]) {
            cart[id].quantity++;
        } else {
            cart[id] = { ...product, quantity: 1 };
        }
        updateCart();
    });

    // Eventos de botones en el carrito
    $('#cart-table').on('click', '.btn-increase', function() {
        const id = $(this).data('id');
        cart[id].quantity++;
        updateCart();
    });

    $('#cart-table').on('click', '.btn-decrease', function() {
        const id = $(this).data('id');
        if (cart[id].quantity > 1) {
            cart[id].quantity--;
        } else {
            delete cart[id];
        }
        updateCart();
    });

    $('#cart-table').on('click', '.btn-remove', function() {
        const id = $(this).data('id');
        delete cart[id];
        updateCart();
    });

    // Evento para el botón de pagar
    $(document).on('click', '#btn-pay', function() {
        alert('Tu compra se ha realizado con éxito');
        cart = {};
        updateCart();
    });

    // Inicializar la carga de productos
    loadProducts();
});
