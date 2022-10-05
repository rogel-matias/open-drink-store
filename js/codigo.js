import { BBDD } from "./stock.js";
import { multiplicarDosNum } from "./operaciones.js";
import { enviarCarritoStorage, obtenerCarritoStorage } from "./localStorage.js";



let carrito = obtenerCarritoStorage() || [];


// Funcion a ejecutar
const pintarBebidas = () => {

    const $contenedor = document.getElementById('tienda-container');

    $contenedor.innerHTML = '';
    // Recorremos el array y pintamos cada objeto dentro

    BBDD.forEach(({id, img, textAlt, nombre, volumen, precio}) => {
        
        const $div = document.createElement('div');
        $div.classList.add('col-lg-3', 'col-sm-6', 'mb-5', 'd-flex', 'justify-content-center');
        $div.innerHTML = 
            ` 
            <div class="card background-pink borderRed" style="width: 18rem;">
                <img src="${img}" class="card-img-top p-4" alt="${textAlt}">
                <div id="card-body" class="card-body d-flex flex-column justify-content-around p-1 cardBorder backgroundCard">
                    <h5 class="card-title m-3 fs-4">${nombre}</h5>
                    <div class="container d-flex justify-content-around align-items-center">
                        <div class="flex-grow-5 text-start">
                            <p class="mb-1">Volumen: <b>${volumen}</b></p>
                            <p class="mb-2">Precio: <b>$${precio}</b></p>
                        </div>
                        <div class="d-flex flex-column justify-content-center align-items-center">
                            <button id="cantidad-mas${id}" class="btn-cantidad cantidad-shadow" type="button">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                            <div id="cantidad${id}">
                            <span>1</span>
                            </div>
                            <button id="cantidad-menos${id}" class="btn-cantidad cantidad-shadow" type="button">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                        </div>
                    </div>  
                    <a id="btn-agregar${id}" class="btn btn-danger m-2">Añadir al carrito</a>
                </div>
            </div>
            `;       

        $contenedor.appendChild($div);

        let $botonAgregar = document.getElementById(`btn-agregar${id}`);
        $botonAgregar.addEventListener('click', () => {
            bebidasEnCarrito(id);
        })
        cantidadBebida(id);    
    })
};



const bebidasEnCarrito = (idBebida) => {

    // Funcionalidad de carga del carrito

    let producto = BBDD.find(bebida => bebida.id == idBebida);
    let productoEnCarrito = carrito.find(producto => producto.id == idBebida);

    // Validamos para que no se repita el producto en el carrito

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += producto.cantidad;
        alert('¡Has agregado este producto nuevamente!\n\nAtento a las cantidades antes de realizar la compra');
    } else {
        carrito.push(producto);
    }

    pintarCarrito(carrito);   
    calcularTotal(carrito);
    enviarCarritoStorage(carrito); 
}



const pintarCarrito = (carrito) => {

    // Renderizacion del carrito de compras

    const $container = document.getElementById(`modal-container`);
    
    $container.innerText = '';

    carrito.forEach(({nombre, precio, cantidad, img, textAlt}, index) => {

        const $div = document.createElement('div');
        $div.classList.add("producto-modal", "pt-2", "flex-row", "justify-content-between","background-pink");
        $div.innerHTML = 
            `
            <div>
                <p class="m-0">Producto: ${nombre}</p>
                <p class="m-0">Precio unidad: ${precio}</p>
                <p class="m-0">Cantidad: ${cantidad}</p>
                <button id="eliminar-bebida" class="mt-3 ms-3" type="button">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <div>
                <div class="background-pink" style="width: 80px;">
                    <img src="${img}" class="card-img-top " alt="${textAlt}">
                </div>        
            </div>
            `;
        
        $div.querySelector('button').addEventListener('click', () => {
            eliminarBebidaCarrito(index);
        })

        $container.appendChild($div);
    })
    
}



const eliminarBebidaCarrito = (indexCarrito) => {

    carrito.splice(indexCarrito,1);
    pintarCarrito(carrito);
    calcularTotal(carrito);

    alert('El producto fue eliminado del carrito');

    enviarCarritoStorage(carrito);
}
    


const cantidadBebida = (idBebida) => {

    // Funcionalidad de la eleccion de cantidades

    const producto = BBDD.find(bebida => bebida.id === idBebida);
    const $botonMas = document.getElementById(`cantidad-mas${idBebida}`);
    const $botonMenos = document.getElementById(`cantidad-menos${idBebida}`);

    $botonMas.addEventListener('click', () => {
        producto.cantidad++;
        pintarCantidad(producto.id);
    })
    
    $botonMenos.addEventListener('click', () => {
        if (producto.cantidad > 1) {
            producto.cantidad--;
            pintarCantidad(producto.id);
        }
    })
}



const pintarCantidad = (idBebida) => {

    // Renderizacion de la eleccion de cantidades en las cards

    const producto = BBDD.find(bebida => bebida.id === idBebida);
    const $div = document.getElementById(`cantidad${idBebida}`);
    $div.innerHTML = `<span>${producto.cantidad}</span>`;

    return producto.cantidad;
}



const calcularTotal = () => {

    let total = 0;
    let $container = document.getElementById('total-print');
    $container.innerHTML = '';

    carrito.forEach(({precio, cantidad}) => {
        total += multiplicarDosNum(precio, cantidad);
    })
    
    const $p = document.createElement('p');
    $p.innerHTML = `<p><b>TOTAL:</b> $${total}</p>`;

    $container.appendChild($p);
}




export {pintarBebidas, calcularTotal, pintarCarrito, carrito, bebidasEnCarrito}



