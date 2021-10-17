import * as d3 from "d3";
// Exponerlo archivo de datos en el servidor local
require("file-loader?name=data/desempleo_ue_y_eurozona.csv!./data/desempleo_ue_y_eurozona.csv");
const dataURL = "http://localhost:8080/data/desempleo_ue_y_eurozona.csv";

d3.csv (dataURL).then ( data => {
    window.dataGlobal = data //Hace global a una determinada variable

    d3.select(".grafico")
        .selectAll('div') // Seleccionar todos los elementos div dentro de la selección
        .data(data) // Los datos en base a los cuales se crearan los elementos
        .enter() // Conecta los data con los elementos del DOM
        .append('div') // Agrega un elemento div en cada iteración
        .attr("id", (d, i) => `a${i}`) // Asignar id a cada elemento
        .attr("class", () => "value") // Agregar estilo
        .style( "height", d => `${d.ue * 10}px`) // Asignar alto
        .text( d => d.ue) // Agrega texto dentro
        .style( "background-color", function(d) {

            //Saca el valor máximo y el valor mínimo de la tabla
            var divs = document.querySelectorAll(".value");
            var arr = [];
            for(var i = 0; i < divs.length; i++){
                arr.push(document.getElementsByClassName('value')[i].innerHTML);
            }

            //console.log(arr); //Comprobar se está obteniendo los valores de los divs
            
            //Toma los valores mínimo y luego máximo para el calculo de colores
            var min = Math.min.apply(null, arr);
            var max = Math.max.apply(null, arr);

            //Asigna los colores dependiendo de la tasa de desempleo
            var x = max - d.ue;
            var g = (255 * x)/min;
            var r = 255 - g;
            return "rgb(" + r + "," + g + ", 0)"
        })
        .style( "margin-top", "50px");
})

//Funciones para aparecer o desaparecer el valor de la barra seleccionada

    //Aparecer
document.onmouseover = function(e) {
    var targ;
    if (!e) var e = window.event;
    if (e.target) targ = e.target;
    //console.log(targ.id); //Verificar que está seleccionando el Id
    document.getElementById(targ.id).style.zIndex = 1000;
    document.getElementById(targ.id).style.color = "black";
 }
    //Desaparecer
 document.onmouseout = function(e) {
    var targ;
    if (!e) var e = window.event;
    if (e.target) targ = e.target;
    //console.log(targ.id); //Verificar que está seleccionando el Id
    document.getElementById(targ.id).style.zIndex = 0;
    document.getElementById(targ.id).style.color = "transparent";
 }


 //Creación de eje inferior

    // Creación de una escala
 var scale = d3.scaleLinear()
 .domain([0, 68]) //total de 68 meses
 .range([0, 900]);

    // Creación de un eje
var axis = d3.axisBottom(scale)

// Seleccionamos el grupo dentro del svg
d3.select('.eje')  
 .attr("transform", "translate(55, 0)") // Se alínea a la derecha
 .call(axis);  // Se inserta el eje

 //Creación de eje izquierdo

    // Creación de una escala
 var scale2 = d3.scaleLinear()
 .domain([11, 0]) //Hasta 11%
 .range([0, 110]);

    // Creación de un eje
var axis2 = d3.axisLeft(scale2)

// Seleccionamos el grupo dentro del svg
d3.select('.eje2')  
 .attr("transform", "translate(30, 70)") // Se alínea a la derecha y abajo
 .call(axis2);  // Se inserta el eje



//Tabla de data


//Para mostrar los data como tabla
d3.csv (dataURL).then ( function(data) {

    var elementoUl = d3.select(".tabla").append('ul');

    elementoUl
        .selectAll('li') //Selección de tantas Li como haga falta
        .data(data) //Join
        .enter()
        .append('li')
        .text( function(d) {return d.Año})
});

d3.csv (dataURL).then ( function(data) {

    var elementoUl = d3.select(".tabla").append('ul');

    elementoUl
        .selectAll('li') //Selección de tantas Li como haga falta
        .data(data) //Join
        .enter()
        .append('li')
        .text( function(d) {return d.periodo})
});

d3.csv (dataURL).then ( function(data) {

    var elementoUl = d3.select(".tabla").append('ul');

    elementoUl
        .selectAll('li') //Selección de tantas Li como haga falta
        .data(data) //Join
        .enter()
        .append('li')
        .text( function(d) {return d.ue + "%"})
});