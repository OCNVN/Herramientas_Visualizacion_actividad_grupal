import * as d3 from "d3";
// Exponerlo archivo de datos en el servidor local
require("file-loader?name=data/desempleo_ue_y_eurozona.csv!./data/desempleo_ue_y_eurozona.csv");
const dataURL = "http://localhost:8080/data/desempleo_ue_y_eurozona.csv";

d3.csv(dataURL).then ( data => {

    const porcentajes = data.map(d => d.ue);

    const porcentajeMinimo = Math.min.apply(null, porcentajes);
    const porcentajeMaximo = Math.max.apply(null, porcentajes);

    const barras = d3.select(".grafico")
        .selectAll('div') // Seleccionar todos los elementos div dentro de la selección
        .data(data) // Los datos en base a los cuales se crearan los elementos
        .enter() // Conecta los data con los elementos del DOM
        .append('div') // Agrega un elemento div en cada iteración
        .attr("id", (d, i) => `a${i}`) // Asignar id a cada elemento
        .classed("bar", true) // Agregar estilo
        .style( "height", d => `${d.ue * 10}px`) // Asignar alto
        .style( "background-color", d => {
            // Asigna los colores dependiendo de la tasa de desempleo
            var x = porcentajeMaximo - d.ue;
            var g = (255 * x)/porcentajeMinimo;
            var r = 255 - g;
            return "rgb(" + r + "," + g + ", 0)"
        })
        .style( "margin-top", "50px");


    // Control de eventos de mouse para mostrar el valor de cada barra
    // dependiendo de la posicion del raton modifica el css de la barra
    barras.on("mouseover", event => {
        const barra = d3.select(event.target);
        barra.classed("bar-mousehover", true);
        barra.classed("bar-mouseout", false);
    })
    barras.on("mouseout", event => {
        const barra = d3.select(event.target);
        barra.classed("bar-mousehover", false);
        barra.classed("bar-mouseout", true);
    });


    // Agregar tooltip a cada barra
    barras.append('div')
        .classed("tooltip", true)
        .text( d => `${d.ue}%`) // Agrega texto dentro


    
    // Mostrar en tabla
    var elementoUl = d3.select(".tabla").append('ul');

    elementoUl
        .selectAll('li') //Selección de tantas Li como haga falta
        .data(data) //Join
        .enter()
        .append('li')
        .text( function(d) {return d.Año})

    var elementoUl = d3.select(".tabla").append('ul');

    elementoUl
        .selectAll('li') //Selección de tantas Li como haga falta
        .data(data) //Join
        .enter()
        .append('li')
        .text( function(d) {return d.periodo})

    var elementoUl = d3.select(".tabla").append('ul');

    elementoUl
        .selectAll('li') //Selección de tantas Li como haga falta
        .data(data) //Join
        .enter()
        .append('li')
        .text( function(d) {return d.ue + "%"})
})

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