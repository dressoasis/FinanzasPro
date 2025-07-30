// 📌 Endpoints for categories and movements
const endpointCategories = "http://localhost:3000/categories";
const endpointMovements = "http://localhost:3000/movimientos";

// 📌 DOM elements
const btnLogout = document.getElementById("logout-btn");
const formMovements = document.getElementById("form-movimiento");
const tbodyMovements = document.getElementById("tbody-movimientos");
const selectCategories = formMovements.categoria;

btnLogout.addEventListener("click", () => {
    // Remove user session data and redirect to home page
    localStorage.removeItem("currentUser");
    window.location.href = "/";
});

let editingMovement = null;  // Track if currently editing a movement
let currentOrder = "";

// 📌 Load data when page loads
document.addEventListener("DOMContentLoaded", () => {
    renderCategories();
    editM();
});

async function editM() {
    // Render categories first, then check if there's a movement to edit in localStorage
    renderCategories().then(() => {
        // If there's saved data in localStorage to edit
        const movimientoGuardado = localStorage.getItem("movimientoEditar");

        if (movimientoGuardado) {
            const mov = JSON.parse(movimientoGuardado);

            // Load movement data into the form for editing
            formMovements.tipo.value = mov.tipo;
            formMovements.descripcion.value = mov.descripcion;
            formMovements.importe.value = mov.importe;
            formMovements.fecha.value = mov.fecha;
            formMovements.categoria.value = mov.categoryId;

            editingMovement = mov.id;

            // Clear storage after loading the data
            localStorage.removeItem("movimientoEditar");
        }
    });
}

// 📌 Handle form submit (create or edit movement)
formMovements.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Create new movement object from form values
    const newMovement = {
        tipo: formMovements.tipo.value,
        descripcion: formMovements.descripcion.value,
        importe: formMovements.importe.value,
        fecha: formMovements.fecha.value,
        categoryId: formMovements.categoria.value
    };

    try {
        if (editingMovement) {
            // Editing an existing movement - send PUT request
            await fetch(`${endpointMovements}/${editingMovement}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMovement)
            });
        } else {
            // Creating a new movement - send POST request
            await fetch(endpointMovements, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMovement)
            });
        }

        // Reset editing state and form, then refresh movement list
        editingMovement = null;
        formMovements.reset();
        renderMovements();

    } catch (err) {
        console.error("Error saving movement", err);
    }
});

// 📌 Handle Edit/Delete buttons clicks inside movements table body
tbodyMovements.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.classList.contains("btn-editar")) {
        // Load selected movement data into form for editing
        editingMovement = target.dataset.id;
        formMovements.tipo.value = target.dataset.tipo;
        formMovements.descripcion.value = target.dataset.descripcion;
        formMovements.importe.value = target.dataset.importe;
        formMovements.fecha.value = target.dataset.fecha;
        formMovements.categoria.value = target.dataset.category;

    } else if (target.classList.contains("btn-eliminar")) {
        // Confirm deletion and delete movement if confirmed
        const id = target.dataset.id;
        if (confirm("Are you sure you want to delete this movement?")) {
            try {
                await fetch(`${endpointMovements}/${id}`, { method: "DELETE" });
                renderMovements();
            } catch (err) {
                console.error("Error deleting movement", err);
            }
        }
    }
});

// 📌 Load category options into the select element of the form
async function renderCategories() {
    selectCategories.innerHTML = "";

    const response = await fetch(endpointCategories);
    const categories = await response.json();

    if (categories.length === 0) {
        // Show message if no categories exist
        selectCategories.innerHTML = `
            <option disabled>No categories. Please register at least one.</option>
        `;
    }

    // Populate select with categories options
    categories.forEach(cat => {
        selectCategories.innerHTML += `
            <option value="${cat.id}">${cat.nombre}</option>
        `;
    });
}

// 📌 Fetch movements with their related category embedded
async function fetchMovements() {
    const res = await fetch(`${endpointMovements}?_embed=category`);
    return await res.json();
}
