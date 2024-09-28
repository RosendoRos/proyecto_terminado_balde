let tareas = [];  
let miembros = []; 
let tareasPorPagina = 5;
let paginaActual = 1;
let tareaEditando = null; 

document.addEventListener("DOMContentLoaded", function() {
    cargarTareas();
    cargarMiembros();
    verificarTareas();
});

function cargarTareas() {
    const tareasGuardadas = localStorage.getItem("tareas");
    if (tareasGuardadas) {
        tareas = JSON.parse(tareasGuardadas);  
    }
}

function cargarMiembros() {
    const miembrosGuardados = localStorage.getItem("miembros");
    if (miembrosGuardados) {
        miembros = JSON.parse(miembrosGuardados);
        mostrarMiembros(); 
    }
}

function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));  
}

function guardarMiembros() {
    localStorage.setItem("miembros", JSON.stringify(miembros)); 
}

function verificarTareas() {
    const tabla = document.getElementById("tablaTareas");
    const mensajeSinTareas = document.getElementById("mensajeSinTareas");

    if (tareas.length === 0) {
        tabla.style.display = "none";
        mensajeSinTareas.style.display = "block"; 
        document.getElementById("paginacion").style.display = "none";
    } else {
        tabla.style.display = "table";
        mensajeSinTareas.style.display = "none";
        document.getElementById("paginacion").style.display = tareas.length > tareasPorPagina ? "block" : "none";
    }

    mostrarTareas();
}


function mostrarTareas() {
    const tabla = document.getElementById("tablaTareas").querySelector("tbody");
    tabla.innerHTML = "";

    const inicio = (paginaActual - 1) * tareasPorPagina;
    const fin = inicio + tareasPorPagina;
    const tareasMostrar = tareas.slice(inicio, fin);  // Solo mostrar las tareas de la página actual

    tareasMostrar.forEach((tarea, index) => {
        const fechaFormateada = new Date(tarea.fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>${inicio + index + 1}</td>
            <td>${tarea.titulo}</td>
            <td>${fechaFormateada}</td>
            <td onclick="toggleEstado(this)">${getEstadoIcono(tarea.estado)}</td>
            <td>${tarea.miembro}</td>
            <td style="${getPrioridadEstilo(tarea.prioridad)}">${tarea.prioridad}</td> 
            <td>
                <div class="icon-group d-flex flex-md-row flex-column align-items-center">
                    <span class="icono-accion" onclick="abrirTarea(${inicio + index})" style="cursor: pointer; margin-right: 10px; color: blue;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg>  
                    </span>
                    <span class="icono-accion" onclick="prepararEdicion(${inicio + index})" style="cursor: pointer; margin-right: 10px; color: orange;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </span>
                    <span class="icono-accion" onclick="eliminarTarea(${inicio + index})" style="cursor: pointer; color: red;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </span>
                </div>
            </td>
        `;
        tabla.appendChild(nuevaFila);
    });

    actualizarPaginacion();
}


function actualizarPaginacion() {
    const totalPaginas = Math.ceil(tareas.length / tareasPorPagina);
    const paginacion = document.querySelector("#paginacion .pagination");
    paginacion.innerHTML = "";

    // Botón anterior
    const prevItem = document.createElement("li");
    prevItem.classList.add("page-item");
    prevItem.innerHTML = `<a class="page-link" href="#" aria-label="Previous" onclick="cambiarPagina(-1)">
                            <span aria-hidden="true">&laquo;</span>
                          </a>`;
    paginacion.appendChild(prevItem);

    // Crear elementos de páginas dinámicamente
    for (let i = 1; i <= totalPaginas; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        pageItem.innerHTML = `<a class="page-link" href="#" onclick="cambiarPagina(${i - paginaActual})">${i}</a>`;
        paginacion.appendChild(pageItem);
    }

    // Botón siguiente
    const nextItem = document.createElement("li");
    nextItem.classList.add("page-item");
    nextItem.innerHTML = `<a class="page-link" href="#" aria-label="Next" onclick="cambiarPagina(1)">
                            <span aria-hidden="true">&raquo;</span>
                          </a>`;
    paginacion.appendChild(nextItem);

    // Mostrar la paginación solo si hay más de una página
    document.getElementById("paginacion").style.display = totalPaginas > 1 ? "block" : "none";
}

const estados = ["pendiente", "en progreso", "completada", "cancelada"];

function toggleEstado(element) {
    const fila = element.closest('tr');
    let estadoActual = tareas[fila.rowIndex - 1].estado;
    let nuevoEstado = estados[(estados.indexOf(estadoActual) + 1) % estados.length];

    element.textContent = getEstadoIcono(nuevoEstado);
    element.title = nuevoEstado;

    tareas[fila.rowIndex - 1].estado = nuevoEstado;

    guardarTareas();
    verificarTareas(); 
}

function getEstadoIcono(estado) {
    switch (estado) {
        case "pendiente":
            return `⬜ Pendiente`;
        case "en progreso":
            return `🔄 En Progreso`;
        case "completada":
            return `✅ Completada`;
        case "cancelada":
            return `🚫 Cancelada`;
        default:
            return `⬜ Pendiente`;
    }
}

const estilos = `
.estado-pendiente { color: orange; }
.estado-en-progreso { color: blue; }
.estado-completada { color: green; }
.estado-cancelada { color: red; }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = estilos;
document.head.appendChild(styleSheet);

function getEstadoIcono(estado) {
    switch (estado) {
        case "pendiente":
            return `<span class="estado-pendiente" title="Pendiente">⬜ Pendiente</span>`;
        case "en progreso":
            return `<span class="estado-en-progreso" title="En Progreso">🔄 En Progreso</span>`;
        case "completada":
            return `<span class="estado-completada" title="Completada">✅ Completada</span>`;
        case "cancelada":
            return `<span class="estado-cancelada" title="Cancelada">🚫 Cancelada</span>`;
        default:
            return `<span class="estado-pendiente" title="Pendiente">⬜ Pendiente</span>`;
    }
}

function agregarTarea() {
    const titulo = document.getElementById("nuevaTarea").value;
    const fecha = document.getElementById("nuevaFecha").value;
    const miembro = document.getElementById("miembroSeleccionado").value;
    const prioridad = document.getElementById("prioridadSeleccionada").value;
    const detalles = document.getElementById("detalles").value;

    if (titulo && fecha && miembro) {
        const nuevaTarea = { titulo, fecha, estado: "pendiente", miembro, prioridad, detalles};
        if (tareaEditando !== null) {
            tareas[tareaEditando] = nuevaTarea; 
            tareaEditando = null;
            document.getElementById("tituloFormulario").textContent = "AGREGAR TAREA NUEVA";
            document.getElementById("botonGuardar").textContent = "Agregar Tarea"; 
        } else {
            tareas.push(nuevaTarea);  
        }

        guardarTareas();
        verificarTareas();
        ocultarFormularioTarea();  
    } else {
        alert("Por favor, complete todos los campos.");
    }
}

function prepararEdicion(index) {
    tareaEditando = index;
    const tarea = tareas[index];
    document.getElementById("nuevaTarea").value = tarea.titulo;
    document.getElementById("nuevaFecha").value = tarea.fecha;
    document.getElementById("miembroSeleccionado").value = tarea.miembro;
    document.getElementById("prioridadSeleccionada").value = tarea.prioridad;
    document.getElementById("detalles").value = tarea.detalles;

    document.getElementById("tituloFormulario").textContent = "EDITAR TAREA"; 
    document.getElementById("botonGuardar").textContent = "GUARDAR CAMBIOS"; 
    mostrarFormularioTarea();
}

function eliminarTarea(index) {
    tareas.splice(index, 1);  
    guardarTareas();
    verificarTareas(); 
}

function mostrarMiembros() {
    const select = document.getElementById("miembroSeleccionado");
    select.innerHTML = '<option value="">Seleccionar miembro</option>'; 

    miembros.forEach(miembro => {
        const option = document.createElement("option");
        option.value = miembro.nombre; 
        option.textContent = miembro.nombre;
        select.appendChild(option);
    });
}

function agregarMiembro() {
    const nombre = document.getElementById("nuevoMiembroNombre").value;
    const email = document.getElementById("nuevoMiembroEmail").value;

    if (nombre && email) {
        const nuevoMiembro = { nombre, email };
        miembros.push(nuevoMiembro);  
        guardarMiembros();  
        mostrarMiembros(); 
        ocultarFormularioMiembro(); 
    } else {
        alert("Por favor, complete todos los campos del miembro.");
    }
}

function cambiarPagina(cambio) {
    const totalPaginas = Math.ceil(tareas.length / tareasPorPagina);
    paginaActual = Math.max(1, Math.min(totalPaginas, paginaActual + cambio));
    mostrarTareas();  // Mostrar las tareas de la nueva página
}

function mostrarFormularioTarea() {
    document.getElementById("formularioTarea").style.display = "block"; 
    document.getElementById("menuOpciones").style.display = "none";  
}

function ocultarFormularioTarea() {
    document.getElementById("formularioTarea").style.display = "none";  
    document.getElementById("nuevaTarea").value = "";  
    document.getElementById("nuevaFecha").value = "";  
    document.getElementById("miembroSeleccionado").value = "";  
}

function mostrarFormularioMiembro() {
    document.getElementById("formularioMiembro").style.display = "block";  
    document.getElementById("menuOpciones").style.display = "none";  
}

function ocultarFormularioMiembro() {
    document.getElementById("formularioMiembro").style.display = "none";  
    document.getElementById("nuevoMiembroNombre").value = "";  
    document.getElementById("nuevoMiembroEmail").value = "";  
}

function toggleMenu() {
    const menuOpciones = document.getElementById("menuOpciones");
    menuOpciones.style.display = (menuOpciones.style.display === "none" || menuOpciones.style.display === "") ? "block" : "none";
}

function buscarTarea() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const tabla = document.getElementById("tablaTareas");
    const tbody = tabla.querySelector("tbody");
    const filas = tbody.getElementsByTagName("tr");
    let hayResultados = false;

    for (let i = 0; i < filas.length; i++) {
        const tareaTitulo = filas[i].cells[1].textContent.toLowerCase();
        if (tareaTitulo.includes(input)) {
            filas[i].style.display = ""; 
            hayResultados = true;
        } else {
            filas[i].style.display = "none";
        }
    }

    const mensajeSinResultados = document.getElementById("mensajeSinTareas");
    const paginacion = document.getElementById("paginacion");
    const botonRestaurar = document.getElementById("botonRestaurar");

    if (!hayResultados) {
        tabla.style.display = "none"; 
        mensajeSinResultados.textContent = "NO SE ENCONTRARON RESULTADOS";
        mensajeSinResultados.style.display = "block"; 
        paginacion.style.display = "none";
    } else {
        tabla.style.display = "table";
        mensajeSinResultados.style.display = "none";
        paginacion.style.display = "block";
    }

    botonRestaurar.style.display = "block"; 
}

function restaurarTabla() {
    const tabla = document.getElementById("tablaTareas");
    const filas = tabla.querySelector("tbody").getElementsByTagName("tr");

    for (let i = 0; i < filas.length; i++) {
        filas[i].style.display = ""; 
    }

    document.getElementById("searchInput").value = "";

    tabla.style.display = "table";
    document.getElementById("mensajeSinTareas").style.display = "none";
    document.getElementById("paginacion").style.display = "block";
    document.getElementById("botonRestaurar").style.display = "none"; 
}

function getPrioridadEstilo(prioridad) {
    switch (prioridad) {
        case "alta":
            return "color: red;";
        case "normal":
            return "color: orange;";
        case "baja":
            return "color: green;";
        default:
            return "";
    }
}

function abrirTarea(index) {
    window.location.href = `ver_tarea.html?index=${index}`;
}
