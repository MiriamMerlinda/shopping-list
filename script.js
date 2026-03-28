// ======================== 📦 ESTADO GLOBAL ========================
let lista = [];

// ======================== ➕ AGREGAR PRODUCTO ========================
function agregarProducto() {
  const input = document.getElementById("inputProducto");
  const texto = input.value.trim();
  if (texto === "") return;
  lista.unshift({ nombre: texto, comprado: false });
  input.value = "";
  mostrarLista();
}

// ======================== 🔄 RENDERIZAR LISTA ========================
function mostrarLista() {
  const ul = document.getElementById("lista");
  const contador = document.getElementById("contador");

  ul.innerHTML = "";

  const pendientes = lista.filter(item => !item.comprado);
  const comprados = lista.filter(item => item.comprado);

  contador.textContent = `🛒 ${pendientes.length} pendientes | ✔️ ${comprados.length} comprados`;

  if (pendientes.length) crearSeccion("Pendientes", pendientes, ul, false);
  if (comprados.length) crearSeccion("Comprados", comprados, ul, true);
}

// ======================== 📂 CREAR SECCIONES ========================
function crearSeccion(tituloTexto, items, contenedor, esComprado) {
  const titulo = document.createElement("p");
  titulo.textContent = tituloTexto;
  titulo.className = "seccion";
  contenedor.appendChild(titulo);

  items.forEach(item => {
    const indexOriginal = lista.indexOf(item);
    const li = document.createElement("li");

    li.innerHTML = `
      <div onclick="marcar(${indexOriginal})" style="display:flex; align-items:center; gap:10px; cursor:pointer;">
        <span class="btn-check">
          <img src="${esComprado ? 'check.png' : 'uncheck.png'}" class="icono-check">
        </span>
        <span style="${esComprado ? 'text-decoration: line-through; color: gray; font-style: italic;' : ''}">
          ${item.nombre}
        </span>
      </div>
      <button class="btn-eliminar" onclick="eliminar(${indexOriginal})">
        <img src="delete.png" class="icono-eliminar" alt="Eliminar">
      </button>
    `;

    contenedor.appendChild(li);
  });
}

// ======================== ✔️ MARCAR / DESMARCAR ========================
function marcar(index) {
  lista[index].comprado = !lista[index].comprado;
  mostrarLista();
}

// ======================== ❌ ELIMINAR ========================
function eliminar(index) {
  lista.splice(index, 1);
  mostrarLista();
}

// ======================== 🖨️ IMPRIMIR ========================
function imprimirLista() {
  window.print();
}

// ======================== 🧹 LIMPIAR ========================
function limpiarLista() {
  lista = [];
  mostrarLista();
}

// ======================== 📄 GUARDAR PDF ========================
async function guardarPDF() {
  const { jsPDF } = window.jspdf;
  const pendientes = lista.filter(item => !item.comprado);

  const exportContainer = document.createElement("div");
  exportContainer.style.position = "fixed";
  exportContainer.style.top = "-10000px";
  exportContainer.style.left = "-10000px";
  exportContainer.style.width = "600px";
  exportContainer.style.padding = "20px";
  exportContainer.style.backgroundColor = "#f0f0f0";
  exportContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  exportContainer.style.borderRadius = "10px";
  exportContainer.style.fontSize = "16px";
  exportContainer.style.lineHeight = "1.5";

  const header = document.createElement("h1");
  header.textContent = "Lista de compras";
  header.style.textAlign = "center";
  header.style.marginBottom = "20px";
  header.style.color = "#0a356a";
  header.style.fontWeight = "bold";
  header.style.backgroundColor = "#d9d9d9";
  header.style.padding = "10px 0";
  header.style.borderRadius = "8px";
  exportContainer.appendChild(header);

  const listContainer = document.createElement("div");
  listContainer.style.backgroundColor = "#ffffff";
  listContainer.style.padding = "15px 20px";
  listContainer.style.borderRadius = "8px";

  const ol = document.createElement("ol");
  ol.style.paddingLeft = "20px";
  ol.style.margin = "0";

  pendientes.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.nombre;
    li.style.marginBottom = "8px";
    li.style.color = "#000000";
    ol.appendChild(li);
  });

  listContainer.appendChild(ol);
  exportContainer.appendChild(listContainer);
  document.body.appendChild(exportContainer);

  const canvas = await html2canvas(exportContainer, { scale: 3 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("lista-pendientes.pdf");

  document.body.removeChild(exportContainer);
}