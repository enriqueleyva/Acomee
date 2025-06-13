let allProducts = []; // Almacena todos los productos cargados
let filteredProducts = []; // Almacena los productos después de aplicar filtros
const itemsPerPage = 9;
let currentPage = 1;
let currentCategoryFilter = "Todas"; // Inicia con "Todas"

const productCardsContainer = document.getElementById(
	"product-cards-container"
);
const paginationControls = document.getElementById("pagination-controls");
const categoryBadgesContainer = document.getElementById(
	"category-badges-container"
);
const searchInput = document.getElementById("search-input"); // Referencia al campo de búsqueda
const clearSearchIcon = document.getElementById("clear-search"); // Icono para limpiar búsqueda

// Función para mostrar los productos en las tarjetas
function displayProducts(productsToRender, page) {
	productCardsContainer.innerHTML = ""; // Limpiar el contenedor
	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const productsPage = productsToRender.slice(startIndex, endIndex);

	if (productsPage.length === 0) {
		productCardsContainer.innerHTML =
			'<div class="col-12 text-center text-muted"><p>No se encontraron productos para esta categoría o búsqueda.</p></div>';
		return;
	}

	productsPage.forEach((producto) => {
		const cardCol = document.createElement("div");
		cardCol.classList.add("col-md-4", "col-sm-6", "mb-4");

		// Normalizar la categoría para mostrarla (si no existe, dejar vacío)
		const categoryDisplay = producto.category ? producto.category.trim() : "";
		// Asegurar que image_link_s y url existan, o usar placeholders/vacíos
		const imageUrl =
			producto.image_link_s ||
			"https://via.placeholder.com/150/cccccc/ffffff?text=No+Image";
		const productUrl = producto.url || "#"; // Si no hay URL, el enlace puede no hacer nada

		cardCol.innerHTML = `
                    <div class="card h-100">
                        <img src="${imageUrl}" class="card-img-top" alt="${
			producto.title
		}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${producto.title}</h5>
                            ${
															categoryDisplay
																? `<span class="badge bg-secondary mb-2">${categoryDisplay}</span>`
																: ""
														}
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="card-price">$${parseFloat(
																	producto.price || 0
																).toFixed(2)}</span>
                                <a href="${productUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Ver Producto</a>
                            </div>
                        </div>
                    </div>
                `;
		productCardsContainer.appendChild(cardCol);
	});
}

// Función para generar los controles de paginación
function setupPagination(totalItems) {
	paginationControls.innerHTML = "";
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const createPageItem = (page, text, isDisabled = false, isActive = false) => {
		const li = document.createElement("li");
		li.classList.add("page-item");
		if (isDisabled) li.classList.add("disabled");
		if (isActive) li.classList.add("active");
		li.innerHTML = `<a class="page-link" href="#" data-page="${page}">${text}</a>`;
		return li;
	};

	// Botón "Anterior"
	paginationControls.appendChild(
		createPageItem(currentPage - 1, "&laquo;", currentPage === 1)
	);

	// Números de página
	const maxPageButtons = 10;
	let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
	let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

	if (endPage - startPage + 1 < maxPageButtons) {
		startPage = Math.max(1, endPage - maxPageButtons + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
		paginationControls.appendChild(
			createPageItem(i, i, false, i === currentPage)
		);
	}

	// Botón "Siguiente"
	paginationControls.appendChild(
		createPageItem(currentPage + 1, "&raquo;", currentPage === totalPages)
	);

	// Añadir event listeners a los botones de paginación
	paginationControls.querySelectorAll(".page-link").forEach((link) => {
		link.addEventListener("click", (event) => {
			event.preventDefault();
			const newPage = parseInt(event.target.dataset.page);
			if (
				!isNaN(newPage) &&
				newPage > 0 &&
				newPage <= totalPages &&
				newPage !== currentPage
			) {
				currentPage = newPage;
				displayProducts(filteredProducts, currentPage); // Paginación sobre los productos filtrados
				setupPagination(totalItems); // Regenerar controles
			}
		});
	});
}

// Función para aplicar el filtro de categoría
function applyCategoryFilter(category) {
	currentCategoryFilter = category; // Actualiza el filtro actual
	currentPage = 1; // Siempre vuelve a la primera página cuando se aplica un nuevo filtro

	if (category === "Todas") {
		filteredProducts = allProducts; // Si es "Todas", muestra todos los productos
	} else {
		// Filtra productos donde la categoría coincida (insensible a mayúsculas/minúsculas)
		// y elimina espacios extra para una coincidencia más robusta
		filteredProducts = allProducts.filter(
			(p) =>
				p.category && p.category.trim().toUpperCase() === category.toUpperCase()
		);
	}
	displayProducts(filteredProducts, currentPage); // Muestra los productos filtrados
	setupPagination(filteredProducts.length); // Reconfigura la paginación para los productos filtrados
	updateActiveBadge(category); // Actualiza el estilo del badge activo
}

// Función para generar los badges de categoría y añadir listeners
function generateCategoryBadges(categories) {
	categoryBadgesContainer.innerHTML = ""; // Limpiar contenedor
	// Añadir "Todas" como primera opción si no está ya
	const uniqueCategories = new Set(["Todas", ...categories]);

	uniqueCategories.forEach((categoryName) => {
		const anchorElement = document.createElement("a");
		anchorElement.href = "#";
		anchorElement.classList.add("badge-category");
		anchorElement.textContent = categoryName;
		// Añadir clase 'active-filter' si es la categoría actualmente seleccionada
		if (categoryName === currentCategoryFilter) {
			anchorElement.classList.add("active-filter");
		}

		anchorElement.addEventListener("click", (event) => {
			event.preventDefault();
			applyCategoryFilter(categoryName);
		});

		categoryBadgesContainer.appendChild(anchorElement);
	});
}

// Función para actualizar la clase 'active-filter' en los badges
function updateActiveBadge(selectedCategory) {
	const badges = categoryBadgesContainer.querySelectorAll(".badge-category");
	badges.forEach((badge) => {
		if (badge.textContent === selectedCategory) {
			badge.classList.add("active-filter");
		} else {
			badge.classList.remove("active-filter");
		}
	});
}

// Tu función desencriptar
function desencriptar(data) {
	const key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012");
	const iv = CryptoJS.enc.Utf8.parse("1234567890123456");

	console.log(data);
	const encrypted = data;

	try {
		const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		});
		const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
		const result = JSON.parse(decryptedString);
		console.log(result);
		// Asegúrate de que 'result' sea el array de productos
		// Si el JSON desencriptado es un array directamente, usa result.
		// Si el JSON desencriptado es un objeto con una propiedad que contiene el array, ajústalo.
		allProducts = JSON.parse(result); // O result.products si tu JSON tiene esa estructura
		console.log(allProducts, typeof allProducts);
		// Normalizar las categorías al cargar todos los productos
		allProducts = allProducts.map((p) => ({
			...p,
			category: p.category ? p.category.trim() : "", // Limpiar espacios en blanco
		}));

		filteredProducts = allProducts; // Inicialmente, todos los productos están filtrados

		// Obtener categorías únicas de todos los productos para generar los badges
		const uniqueCategoriesFromProducts = [
			...new Set(allProducts.map((p) => p.category).filter(Boolean)),
		];
		generateCategoryBadges(uniqueCategoriesFromProducts); // Genera los badges con las categorías encontradas

		applyCategoryFilter(currentCategoryFilter); // Aplica el filtro inicial ("Todas")
	} catch (error) {
		console.error("Error al desencriptar o parsear el JSON:", error);
		productCardsContainer.innerHTML =
			'<div class="col-12"><p class="text-danger">Error al procesar los datos.</p></div>';
	}
}

// Tu función getData
function getData(buscarTexto) {
	document.getElementById("loader").style.display = "block";
	document.getElementById("search-input").disabled = true;
	var settings = {
		url: `http://216.225.203.100/search_acomee`,
		type: "POST",
		data: JSON.stringify({
			busqueda: buscarTexto,
		}),
		headers: {
			"Content-Type": "application/json",
		},
		// contentType: "application/json; charset=utf-8", // Asegúrate de enviar JSON correctamente
		// dataType: "json", // Esperar una respuesta JSON
	};

	$.ajax(settings)
		.done(function (response) {
			console.log("Respuesta de la API:", response);
			const data = JSON.parse(response);
			// Asumiendo que response ya es un objeto JSON y contiene 'respuesta.respuesta'
			if (data && data.encrypted_results) {
				desencriptar(data.encrypted_results);
			} else {
				console.error("Estructura de respuesta inesperada:", response);
				productCardsContainer.innerHTML =
					'<div class="col-12"><p class="text-danger">Estructura de datos inesperada de la API.</p></div>';
			}
			document.getElementById("loader").style.display = "none";
			document.getElementById("search-input").disabled = false;
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			document.getElementById("loader").style.display = "none";
			document.getElementById("search-input").disabled = false;
			console.error(
				"Error al obtener datos de la API:",
				textStatus,
				errorThrown
			);
			productCardsContainer.innerHTML =
				'<div class="col-12"><p class="text-danger">No se pudieron cargar los datos de la API. Inténtalo de nuevo más tarde.</p></div>';
		});
}

// Evento para el campo de búsqueda (al presionar Enter)
searchInput.addEventListener("keyup", (event) => {
	if (event.key === "Enter") {
		console.log(searchInput.value);
		getData(searchInput.value);
		// applySearchFilter();
		// // Opcional: Deseleccionar el badge de categoría activa al buscar
		// currentCategoryFilter = "Todas";
		// updateActiveBadge(currentCategoryFilter);
	}
});

// Evento para el icono de limpiar búsqueda (la 'x')
clearSearchIcon.addEventListener("click", () => {
	searchInput.value = ""; // Limpia el campo
	currentSearchTerm = ""; // Limpia el término de búsqueda en la variable
	applyFilters(); // Re-aplica los filtros (sin término de búsqueda)
});
