const endpointCategories = "http://localhost:3000/categories"
const endpointMovimientos = "http://localhost:3000/movimientos"

const btnLogout = document.getElementById("logout-btn");
const tbCategoriaVentas = document.getElementById("categoria-mayor-venta")
const tbCategoriaCompras = document.getElementById("categoria-mayor-compra")
const tbProductventas = document.getElementById("producto-mas-vendido")
const tbProductoCompras = document.getElementById("producto-mas-comprado")
const tbMesMayorVenta = document.getElementById("mes-mayor-venta")
const tbMesMayorCompra = document.getElementById("mes-mayor-compra")
const selectCategoriaGanancia = document.getElementById("categoria")
const spanGananciaNeta = document.getElementById("ganancia-neta")
const divTotalesMes = document.getElementById("totales-mes")
const spanCategoriaMayorBalance = document.getElementById("categoria-mayor-balance")
const spanBalanceCategoria = document.getElementById("balance-categoria")

// Logout button event listener: removes current user and redirects to home
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/";
});

// On DOM content loaded, call functions to paint various statistics
document.addEventListener("DOMContentLoaded", function () {
  pintarventas()
  pintarCompras()
  pintarproductv()
  pintarproductC()
  pintarMesMayorVenta()
  pintarMesMayorCompra()
  cargarCategoriasParaGanancia()
  pintarGananciaMesActual()
  pintarCategoriaMayorBalance()
})

// Fetch movements from REST API with embedded category data
async function traerMovimientos() {
  let response = await fetch(`${endpointMovimientos}?_embed=category`);
  let data = await response.json();

  return data
}

// Get category with the highest number of sales
async function categoriaConMasVentas() {
  let movimientos = await traerMovimientos()

  let contadorCategorias = {};

  movimientos.forEach(movovimiento => {
    if (movovimiento.tipo === "venta") { // Only sales
      const nombreCat = movovimiento.category.nombre;
      if (!contadorCategorias[nombreCat]) {
        contadorCategorias[nombreCat] = 0;
      }
      contadorCategorias[nombreCat] += 1; // Increment count
    }
  });

  let categoriaMayor = "-";
  let maxCantidad = 0;

  for (const nombreCat in contadorCategorias) {
    if (contadorCategorias[nombreCat] > maxCantidad) {
      maxCantidad = contadorCategorias[nombreCat];
      categoriaMayor = nombreCat;
    }
  }

  return categoriaMayor;
}

// Get category with the highest number of purchases
async function categoriaConMasCompras() {
  let movimientos = await traerMovimientos()

  let contadorCategorias = {};

  movimientos.forEach(movovimiento => {
    if (movovimiento.tipo === "compra") { // Only purchases
      const nombreCat = movovimiento.category.nombre;
      if (!contadorCategorias[nombreCat]) {
        contadorCategorias[nombreCat] = 0;
      }
      contadorCategorias[nombreCat] += 1; // Increment count
    }
  });

  let categoriaMayor = "-";
  let maxCantidad = 0;

  for (const nombreCat in contadorCategorias) {
    if (contadorCategorias[nombreCat] > maxCantidad) {
      maxCantidad = contadorCategorias[nombreCat];
      categoriaMayor = nombreCat;
    }
  }

  return categoriaMayor;
}

// Get product with the highest number of purchases
async function productoConMasCompras() {
  let movimientos = await traerMovimientos()

  let contadorProductosC = {};

  movimientos.forEach(movimiento => {
    if (movimiento.tipo === "compra") {
      const nombreProduct = movimiento.descripcion;
      if (!contadorProductosC[nombreProduct]) {
        contadorProductosC[nombreProduct] = 0;
      }
      contadorProductosC[nombreProduct] += 1; // Increment count
    }
  });

  let productoMayorC = "-";
  let maxCantidad = 0;

  for (const nombreProduct in contadorProductosC) {
    if (contadorProductosC[nombreProduct] > maxCantidad) {
      maxCantidad = contadorProductosC[nombreProduct];
      productoMayorC = nombreProduct;
    }
  }

  return productoMayorC;
}

// Get product with the highest number of sales
async function productoConMasVentas() {
  let movimientos = await traerMovimientos()

  let contadorProductos = {};

  movimientos.forEach(movimiento => {
    if (movimiento.tipo === "venta") {
      const nombreProd = movimiento.descripcion;
      if (!contadorProductos[nombreProd]) {
        contadorProductos[nombreProd] = 0;
      }
      contadorProductos[nombreProd] += 1; // Increment count
    }
  });

  let ProductoMayor = "-";
  let maxCantidad = 0;

  for (const nombreProd in contadorProductos) {
    if (contadorProductos[nombreProd] > maxCantidad) {
      maxCantidad = contadorProductos[nombreProd];
      ProductoMayor = nombreProd;
    }
  }

  return ProductoMayor;
}

// Render most sold product in the UI
async function pintarproductv() {
  const ProductoMasV = await productoConMasVentas()
  tbProductventas.innerHTML = "";
  tbProductventas.innerHTML = `
    <span>${ProductoMasV}</span> 
    `
}

// Render most bought product in the UI
async function pintarproductC() {
  const ProductoMasC = await productoConMasCompras()
  tbProductoCompras.innerHTML = "";
  tbProductoCompras.innerHTML = `
    <span>${ProductoMasC}</span>
    `
}

// Render category with most sales in the UI
async function pintarventas() {

  const ProductoMasV = await categoriaConMasVentas()
  tbCategoriaVentas.innerHTML = "";
  tbCategoriaVentas.innerHTML = `
    <span>${ProductoMasV}</span> 
    `
}

// Render category with most purchases in the UI
async function pintarCompras() {

  const categoriaMasC = await categoriaConMasCompras()
  tbCategoriaCompras.innerHTML = "";
  tbCategoriaCompras.innerHTML = `
    <span>${categoriaMasC}<span>
    `
}

// Extract year-month from date string (format YYYY-MM-DD -> YYYY-MM)
function obtenerMes(fecha) {
  const [año, mes] = fecha.split("-")
  return `${año}-${mes}` // Example: "2025-07"
}

// Get month with the highest number of sales
async function mesConMasVentas() {
  const movimientos = await traerMovimientos()
  const contadorMeses = {}

  movimientos.forEach(m => {
    if (m.tipo === "venta") {
      const mes = obtenerMes(m.fecha)
      contadorMeses[mes] = (contadorMeses[mes] || 0) + 1
    }
  })

  let mesMayor = "-"
  let maxVentas = 0

  for (const mes in contadorMeses) {
    if (contadorMeses[mes] > maxVentas) {
      maxVentas = contadorMeses[mes]
      mesMayor = mes
    }
  }

  return mesMayor
}

// Get month with the highest number of purchases
async function mesConMasCompras() {
  const movimientos = await traerMovimientos()
  const contadorMeses = {}

  movimientos.forEach(m => {
    if (m.tipo === "compra") {
      const mes = obtenerMes(m.fecha)
      contadorMeses[mes] = (contadorMeses[mes] || 0) + 1
    }
  })

  let mesMayor = "-"
  let maxCompras = 0

  for (const mes in contadorMeses) {
    if (contadorMeses[mes] > maxCompras) {
      maxCompras = contadorMeses[mes]
      mesMayor = mes
    }
  }

  return mesMayor
}

// Render month with highest sales in the UI
async function pintarMesMayorVenta() {
  const mes = await mesConMasVentas()
  tbMesMayorVenta.textContent = mes
}

// Render month with highest purchases in the UI
async function pintarMesMayorCompra() {
  const mes = await mesConMasCompras()
  tbMesMayorCompra.textContent = mes
}

// Load categories into the dropdown for profit calculation
async function cargarCategoriasParaGanancia() {
  const response = await fetch(endpointCategories)
  const categorias = await response.json()

  selectCategoriaGanancia.innerHTML = '<option value="" disabled selected>-- Selecciona --</option>'

  categorias.forEach(cat => {
    selectCategoriaGanancia.innerHTML += `
      <option value="${cat.id}">${cat.nombre}</option>
    `
  })
}

// Calculate net profit (sales - purchases) for a given category ID
async function calcularGananciaPorCategoria(idCategoria) {
  const movimientos = await traerMovimientos()

  let ganancia = 0

  movimientos.forEach(m => {
    if (m.categoryId === idCategoria) {
      const importe = parseFloat(m.importe)
      if (m.tipo === "venta") {
        ganancia += importe
      } else if (m.tipo === "compra") {
        ganancia -= importe
      }
    }
  })

  return ganancia
}

// Update displayed net profit when category selection changes
selectCategoriaGanancia.addEventListener("change", async function () {
  const idSeleccionado = this.value
  if (!idSeleccionado) return

  const ganancia = await calcularGananciaPorCategoria(idSeleccionado)

  spanGananciaNeta.textContent = `$${ganancia.toLocaleString("es-CO")}`
})

// Get current year-month in format YYYY-MM
function obtenerMesActual() {
  const hoy = new Date()
  const mes = String(hoy.getMonth() + 1).padStart(2, "0")
  const año = hoy.getFullYear()
  return `${año}-${mes}` // example: "2025-07"
}

// Calculate net profit for current month
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

// Format month string YYYY-MM to readable month name and year
function formatearMes(mesStr) {
  const [año, mes] = mesStr.split("-")
  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
  return `${nombresMeses[parseInt(mes) - 1]} ${año}`
}

// Render total net profit for current month in the UI
async function pintarGananciaMesActual() {
  const { total, mesActual } = await calcularGananciaMesActual()
  const nombreMes = formatearMes(mesActual)

  divTotalesMes.innerHTML = `
    <p><strong>Total en ${nombreMes}:</strong> <span style="color: ${total >= 0 ? 'green' : 'red'}">
      $${total.toLocaleString("es-CO")}
    </span></p>
  `
}

// Calculate category with highest net balance (sales - purchases)
async function categoriaConMayorBalance() {
    const movimientos = await traerMovimientos()
    const balances = {} // { categoryId: { nombre, balance } }

    movimientos.forEach(m => {
        const id = m.categoryId
        const nombre = m.category?.nombre || "Sin nombre"
        const importe = parseFloat(m.importe)

        if (!balances[id]) {
            balances[id] = {
                nombre,
                balance: 0
            }
        }

        if (m.tipo === "venta") {
            balances[id].balance += importe
        } else if (m.tipo === "compra") {
            balances[id].balance -= importe
        }
    })

    let mayor = null

    for (const id in balances) {
        if (!mayor || balances[id].balance > mayor.balance) {
            mayor = balances[id]
        }
    }

    return mayor || { nombre: "-", balance: 0 }
}

// Render category with highest net balance in the UI
async function pintarCategoriaMayorBalance() {
    const mayor = await categoriaConMayorBalance()

    spanCategoriaMayorBalance.textContent = mayor.nombre
    spanBalanceCategoria.innerHTML = `<span style="color: ${mayor.balance >= 0 ? 'green' : 'red'}">
    $${mayor.balance.toLocaleString("es-CO")}
  </span>`
}
