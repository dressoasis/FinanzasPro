# FinanzasPro
prueba de desempeño M2 yM3

FinanzasPRO es una aplicación web para la gestión de finanzas personales que permite registrar, editar y eliminar movimientos financieros, aplicar filtros por tipo, categoría y fechas, y visualizar reportes y balances actualizados. El proyecto está construido con HTML, CSS y JavaScript vanilla, usando json-server para simular un backend REST API.

## Estructura del proyecto

FinanzasPRO/
├── public/
├── src/
│   ├── css/
│   │   ├── categorias.css
│   │   ├── dashboard.css
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── movimientos.css
│   │   └── reportes.css
│   ├── img/
│   ├── js/
│   │   ├── categorias.js
│   │   ├── dashboard.js
│   │   ├── guardian.js
│   │   ├── login.js
│   │   ├── movimientos.js
│   │   └── reportes.js
│   └── views/
│       ├── balance.html
│       ├── categorias.html
│       ├── dashboard.html
│       ├── login.html
│       └── reportes.html
├── index.html
├── package.json
├── package-lock.json
└── db.json
---
## Tecnologías usadas

- HTML5, CSS3 y JavaScript (ES6+)
- Json-server para mock API REST
- Estructura modular con carpetas separadas para CSS, JS e HTML

---

# FinanzasPRO

## Description  
FinanzasPRO is a web application for personal financial management that allows users to register, edit, and delete financial movements (purchases, sales), filter by type, category, and date, and display a summary of the balance.

## Technologies Used  
- HTML5  
- CSS3 (with CSS variables and responsive design)  
- JavaScript (ES6 modules, fetch API)  
- JSON Server for local REST API  

## Installation and Setup  
1. Clone or download the repository.  
2. Make sure Node.js and npm are installed.  
3. Install JSON Server globally using `npm install -g json-server` if you don’t have it.  
4. In the project root folder, run `json-server --watch db.json --port 3000` to start the local REST API on port 3000.  
5. Open the project using a local server, such as Live Server in VSCode, to avoid CORS issues.  
6. Access the app in your browser at the URL provided by your local server.  

## File Structure  
- `index.html`: Login page.  
- `dashboard.html`: Main view with balance summary, movements list, and filters.  
- `balance.html`: Page to create and edit movements.  
- `categorias.html`: Category management page.  
- `reportes.html`: Reports and financial charts page.  
- `css/dashboard.css`: Main styles with responsive design and CSS variables.  
- `js/dashboard.js`: Dashboard logic including loading, filtering, sorting, and rendering movements.  
- `js/guardian.js`: Route protection and access control.  
- `db.json`: JSON database for JSON Server containing movements and categories.  

## Application Usage  
- Users must log in to access the dashboard.  
- `dashboard.html` shows earnings, expenses, and total balance.  
- The movements table allows editing and deleting entries; editing saves data in localStorage and redirects to `balance.html`.  
- On `balance.html`, users can create or update a movement.  
- Filters on the dashboard enable filtering by type, category, date range, and alphabetical sorting.  
- Categories are managed on `categorias.html`.  
- Visual reports are available on `reportes.html`.  

## Technical Details  
- Click events on the movements table body detect edit and delete buttons.  
- Deletion is done via a DELETE request to the REST API.  
- Editing saves movement info in localStorage and redirects to `balance.html`.  
- fetch API with async/await handles API calls.  
- CSS media queries adapt layout for screens smaller than 768px with single-column design and responsive navbar.  
- CSS variables maintain consistent colors and styling.  

## Useful Commands  
- Start JSON Server: `json-server --watch db.json --port 3000`  
- Use Live Server extension in VSCode to serve the project folder locally to avoid CORS issues.  

## Contact  
Andres Camilo Toloza Tejeda
Malecon
andrestolozatejeda@gmail.com
1140895051
For questions or support, contact the FinanzasPRO development team.

