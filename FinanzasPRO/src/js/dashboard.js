const endpointCategories = "http://localhost:3000/categories"
const endpointMovimientos = "http://localhost:3000/movimientos"
const balanceEarning = document.getElementById("earnings")
const balanceBills = document.getElementById("bills")
const totalBalance = document.getElementById("balance-total")
const btnLogout = document.getElementById("logout-btn")
const tbodyMovements = document.getElementById("tbody-movimientos");

let currentOrder = "";
let editingMovement = null;

// Logout button event: clear user and redirect to home page
btnLogout.addEventListener("click", function(){
    localStorage.removeItem("currentUser")
    window.location.href = "/"
})

// When DOM is loaded, initialize the page with data
document.addEventListener("DOMContentLoaded", function(){
    printBalanceEarning();
    printBalanceBills();
    pintarGananciaMesActual();
    fillCategoryFilter();
    renderMovements()
})

// Fetch all movements, embedding category info
async function traerMovimientos() {
    let response = await fetch(`${endpointMovimientos}?_embed=category`);
    let data = await response.json();

    return data
}

// Get current month as "YYYY-MM" string (e.g., "2025-07")
function obtenerMesActual() {
    const hoy = new Date()
    const mes = String(hoy.getMonth() + 1).padStart(2, "0")
    const año = hoy.getFullYear()
    return `${año}-${mes}`
}

// Calculate total earnings ("venta" type) for current month
async function calculateBalanceEarning() {
    const movimientos = await traerMovimientos()
    const mesActual = obtenerMesActual()

    let total = 0

    movimientos.forEach(m => {
        if (m.fecha.startsWith(mesActual)) {
            const importe = parseFloat(m.importe)
            if (m.tipo === "venta") total += importe  // Add only sales
        }
    });
    return { total, mesActual }
}

// Display earnings total with color (green if positive, red if negative)
async function printBalanceEarning() {
    const { total } = await calculateBalanceEarning()

    balanceEarning.innerHTML = `
    <span style="color: ${total >= 0 ? 'green' : 'red'}">
        $${total.toLocaleString("es-CO")}
    </span>`
}

// Calculate total bills ("compra" type) for current month
async function calculateBalanceBills() {
    // ⚠️ Added missing fetch inside this function
    const movimientos = await traerMovimientos();
    const mesActual = obtenerMesActual()

    let total = 0

    movimientos.forEach(m => {
        if (m.fecha.startsWith(mesActual)) {
            const importe = parseFloat(m.importe)
            if (m.tipo === "compra") total += importe  // Add only purchases
        }
    });
    return { total, mesActual }
}

// Display bills total with color coding
async function printBalanceBills() {
    // ⚠️ Fixed: call correct function here
    const { total } = await calculateBalanceBills();

    balanceBills.innerHTML = `
    <span style="color: ${total >= 0 ? 'green' : 'red'}">
        $${total.toLocaleString("es-CO")}
    </span>`
}

// Calculate net gain for current month (sales minus purchases)
async function calcularGananciaMesActual() {
    const movimientos = await traerMovimientos()
    const mesActual = obtenerMesActual()

    let total = 0

    movimientos.forEach(m => {
        if (m.fecha.startsWith(mesActual)) {
            const importe = parseFloat(m.importe)
            if (m.tipo === "venta") total += importe
            else if (m.tipo === "compra") total -= importe
        }
    })

    return { total, mesActual }
}

// Format "YYYY-MM" string to human-readable month and year (e.g., "July 2025")
function formatearMes(mesStr) {
    const [año, mes] = mesStr.split("-")
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]
    return `${nombresMeses[parseInt(mes) - 1]} ${año}`
}

// Show net gain with color styling and formatted month
async function pintarGananciaMesActual() {
    const { total, mesActual } = await calcularGananciaMesActual()
    const nombreMes = formatearMes(mesActual)

    totalBalance.innerHTML = `
    <p><strong>Total en ${nombreMes}:</strong> <span style="color: ${total >= 0 ? 'green' : 'red'}">
        $${total.toLocaleString("es-CO")}
    </span></p>
    `
}

const filtroTipo = document.getElementById("filtro-tipo");
const filtroCategoria = document.getElementById("filtro-categoria");
const filtroFechaInicio = document.getElementById("filtro-fecha-inicio");
const filtroFechaFin = document.getElementById("filtro-fecha-fin");
const btnClearFilters = document.getElementById("btn-limpiar-filtros");
const btnOrderAZ = document.getElementById("orden-az");
const btnOrderZA = document.getElementById("orden-za");

// Clear all filters and reset order
btnClearFilters.addEventListener("click", () => {
    filtroTipo.value = "";
    filtroCategoria.value = "";
    filtroFechaInicio.value = "";
    filtroFechaFin.value = "";
    currentOrder = "";
});

// Add event listeners to filters to apply filters on change
[filtroTipo, filtroCategoria, filtroFechaInicio, filtroFechaFin].forEach(filter => {
    filter.addEventListener("change", applyFilters);
});

// Filter and sort movements, then render filtered results
async function applyFilters() {
    let movements = await traerMovimientos();

    const tipo = filtroTipo.value;
    const categoria = filtroCategoria.value;
    const fechaInicio = filtroFechaInicio.value;
    const fechaFin = filtroFechaFin.value;

    if (tipo) {
        movements = movements.filter(m => m.tipo === tipo);
    }

    if (categoria) {
        // Filter by category id (make sure to use category.id, not categoryId)
        movements = movements.filter(m => String(m.category.id) === String(categoria));
    }

    if (fechaInicio) {
        movements = movements.filter(m => new Date(m.fecha) >= new Date(fechaInicio));
    }

    if (fechaFin) {
        movements = movements.filter(m => new Date(m.fecha) <= new Date(fechaFin));
    }

    // Sort alphabetically by description ascending
    if (currentOrder === "az") {
        movements.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    }

    // Sort alphabetically by description descending
    if (currentOrder === "za") {
        movements.sort((a, b) => b.descripcion.localeCompare(a.descripcion));
    }

    // Clear table body and add filtered movements
    tbodyMovements.innerHTML = "";
    movements.forEach(mov => {
        tbodyMovements.innerHTML += `
            <tr>
                <td>${mov.tipo}</td>
                <td>${mov.descripcion}</td>
                <td>${mov.importe}</td>
                <td>${mov.fecha}</td>
                <td>${mov.category.nombre}</td>
                <td>
                    <button class="btn-editar"
                        data-id="${mov.id}"
                        data-tipo="${mov.tipo}"
                        data-descripcion="${mov.descripcion}"
                        data-importe="${mov.importe}"
                        data-fecha="${mov.fecha}"
                        data-category="${mov.category.id}"  <!-- Use category.id here -->
                    >Edit</button>
                    <button class="btn-eliminar" data-id="${mov.id}">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Fetch categories and populate category filter dropdown
async function fillCategoryFilter() {
    const response = await fetch(endpointCategories);
    const categories = await response.json();

    filtroCategoria.innerHTML = '<option value="">Category</option>';
    categories.forEach(cat => {
        filtroCategoria.innerHTML += `
            <option value="${cat.id}">${cat.nombre}</option>
        `;
    });
}

// Sort buttons event listeners to set order and apply filters
btnOrderAZ.addEventListener("click", () => {
    currentOrder = "az";
    applyFilters();
});

btnOrderZA.addEventListener("click", () => {
    currentOrder = "za";
    applyFilters();
});

// Handle clicks in the movements table for editing or deleting
tbodyMovements.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.classList.contains("btn-editar")) {
        // Prepare movement object from data attributes for editing
        const movimiento = {
            id: target.dataset.id,
            tipo: target.dataset.tipo,
            descripcion: target.dataset.descripcion,
            importe: target.dataset.importe,
            fecha: target.dataset.fecha,
            categoryId: target.dataset.category
        };

        // Save movement data in localStorage for editing page
        localStorage.setItem("movimientoEditar", JSON.stringify(movimiento));

        // Redirect to editing page
        window.location.href = "balance.html";

    } else if (target.classList.contains("btn-eliminar")) {
        // Confirm deletion before removing movement
        const id = target.dataset.id;
        if (confirm("Are you sure you want to delete this movement?")) {
            try {
                await fetch(`${endpointMovimientos}/${id}`, { method: "DELETE" });
                renderMovements(); // Refresh list after deletion
            } catch (err) {
                console.error("Error deleting movement", err);
            }
        }
    }
});

// Render all movements on the page
async function renderMovements() {
    const movements = await traerMovimientos();
    tbodyMovements.innerHTML = "";

    movements.forEach(mov => {
        tbodyMovements.innerHTML += `
            <tr>
                <td>${mov.tipo}</td>
                <td>${mov.descripcion}</td>
                <td>${mov.importe}</td>
                <td>${mov.fecha}</td>
                <td>${mov.category.nombre}</td>
                <td>
                    <button class="btn-editar"
                        data-id="${mov.id}"
                        data-tipo="${mov.tipo}"
                        data-descripcion="${mov.descripcion}"
                        data-importe="${mov.importe}"
                        data-fecha="${mov.fecha}"
                        data-category="${mov.category.id}"  <!-- Consistent category id -->
                    >Edit</button>
                    <button class="btn-eliminar" data-id="${mov.id}">Delete</button>
                </td>
            </tr>
        `;
    });
}
