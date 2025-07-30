const endpointCategories = "http://localhost:3000/categories";
const endpointMovements = "http://localhost:3000/movimientos";

const btnLogout = document.getElementById("logout-btn");
const form = document.getElementById("form-categoria");
const inputName = document.getElementById("nombre-categoria");
const categoriesList = document.getElementById("lista-categorias");


// Logout: remove current user from localStorage and redirect to homepage
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
});

let editingCategory = null; // Stores the ID of category being edited, null if adding new

// Load categories when the page is loaded
document.addEventListener('DOMContentLoaded', loadCategories);

// Fetch categories and display them in the list
async function loadCategories() {
    categoriesList.innerHTML = ''; // Clear the current list
    try {
        const res = await fetch(endpointCategories);
        const categories = await res.json();

        categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${category.nombre}</span>
                <div>
                    <button class="btn-edit" data-id="${category.id}" data-nombre="${category.nombre}">Edit</button>
                    <button class="btn-eliminar" data-id="${category.id}">Delete</button>
                </div>
            `;
            categoriesList.appendChild(li);
        });
    } catch (err) {
        console.log('Error loading categories:', err);
    }
}

// Handle form submission for creating or editing a category
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = inputName.value.trim();
    if (!name) return alert('Name cannot be empty'); // Validate input

    try {
        if (editingCategory) {
            // If editing, send PUT request to update the category
            await fetch(`${endpointCategories}/${editingCategory}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: name })
            });
            editingCategory = null; // Reset editing state
        } else {
            // If creating new category, send POST request
            await fetch(endpointCategories, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: name })
            });
        }

        form.reset(); // Clear form inputs
        loadCategories(); // Reload updated categories list
    } catch (err) {
        console.error('Error saving category:', err);
    }
});

// Event delegation for Edit and Delete buttons inside categories list
categoriesList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('btn-edit')) {
        // Edit button clicked: populate input with current name and set editing state
        const id = event.target.dataset.id;
        const name = event.target.dataset.nombre;
        inputName.value = name;
        editingCategory = id;
    }

    if (event.target.classList.contains('btn-eliminar')) {
        // Delete button clicked: confirm and delete category and its related movements
        const id = event.target.dataset.id;
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                // Fetch all movements to find those related to this category
                const res = await fetch(endpointMovements);
                const movements = await res.json();

                // Filter movements related to the category to delete
                const related = movements.filter(m => m.categoryId === id);

                // Delete all related movements asynchronously
                await Promise.all(related.map(m =>
                    fetch(`${endpointMovements}/${m.id}`, { method: 'DELETE' })
                ));

                // Delete the category itself
                await fetch(`${endpointCategories}/${id}`, { method: 'DELETE' });

                loadCategories(); // Refresh categories list after deletion
            } catch (err) {
                console.error('Error deleting category or associated movements:', err);
            }
        }
    }
});
