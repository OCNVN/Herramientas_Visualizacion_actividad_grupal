import * as d3 from "d3";
// Exponerlo archivo de datos en el servidor local
require("file-loader?name=data/desempleo_ue_y_eurozona.csv!./data/desempleo_ue_y_eurozona.csv");
const dataURL = "http://localhost:8080/data/desempleo_ue_y_eurozona.csv";

var tooltipEU = d3.select('.tooltip-area-eu')
    .style('opacity', 0);
var tooltipEUZ = d3.select('.tooltip-area-euz')
    .style('opacity', 0);

const mouseoverEU = (event, d) => {
    tooltipEU.style("opacity", 1);
};

const mouseleaveEU = (event, d) => {
    tooltipEU.style('opacity', 0);
}

const mousemoveEU = (event, d) => {
    const text = d3.select('.tooltip-area-eu__text');
    const [x, y] = d3.pointer(event);

    text.html(`<span>${d.ue}%</span><span>${d.periodo}/${d['Año']}</span>`);

    tooltipEU.style('transform', `translate(${x}px, ${y + 390}px)`);
};

const mouseoverEUZ = (event, d) => {
    tooltipEUZ.style("opacity", 1);
};

const mouseleaveEUZ = (event, d) => {
    tooltipEUZ.style('opacity', 0);
}

const mousemoveEUZ = (event, d) => {
    const text = d3.select('.tooltip-area-euz__text');
    const [x, y] = d3.pointer(event);

    text.html(`<span>${d.euz}%</span><span>${d.periodo}/${d['Año']}</span>`);

    tooltipEUZ.style('transform', `translate(${x}px, ${y + 390}px)`);
};

d3.csv(dataURL).then ( data => {

    const porcentajes = data.map(d => d.ue);
    const n = data.length;

    const porcentajeMinimo = Math.min.apply(null, porcentajes);
    const porcentajeMaximo = Math.max.apply(null, porcentajes);

    // Grafico Union Europea
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
        .html(d => `<span>${d.ue}%</span><span>${d.periodo}/${d['Año']}</span>`)
        // .text( d => ``) // Agrega texto dentro

    
    // // Mostrar en tabla
    // var elementoUl = d3.select(".tabla").append('ul');

    // elementoUl
    //     .selectAll('li') //Selección de tantas Li como haga falta
    //     .data(data) //Join
    //     .enter()
    //     .append('li')
    //     .text( function(d) {return d.Año})

    // var elementoUl = d3.select(".tabla").append('ul');

    // elementoUl
    //     .selectAll('li') //Selección de tantas Li como haga falta
    //     .data(data) //Join
    //     .enter()
    //     .append('li')
    //     .text( function(d) {return d.periodo})

    // var elementoUl = d3.select(".tabla").append('ul');

    // elementoUl
    //     .selectAll('li') //Selección de tantas Li como haga falta
    //     .data(data) //Join
    //     .enter()
    //     .append('li')
    //     .text( function(d) {return d.ue + "%"})





    // Margenes y dimensiones
    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = window.innerWidth - margin.left - margin.right // Utilizamos el ancho de la ventana
    , height = window.innerHeight - margin.top - margin.bottom; // Utilizamos el alto de la ventana


    // Escalador lineal para eje X
    // var xScale = d3.scaleLinear()
    var xScale = d3.scalePoint()
    // .domain([0, n]) // entrada
    .domain(data.map(d => `${d['Año']}/${d.periodo}`)) // entrada
    .range([0, width]); // salida

    // Escalador lineal para eje Y
    var yScale = d3.scaleLinear()
    .domain([0, 15]) // entrada 
    .range([height, 0]); // salida 

    // Generador de lineas Union Europea
    var lineEU = d3.line()
    .x(function(d, i) { return xScale(`${d['Año']}/${d.periodo}`); }) // Valores X
    .y(function(d) { return yScale(d.ue); }) // Valores Y
    .curve(d3.curveMonotoneX) // Aplicar suavizador

    // Generador de lineas Eurozona
    var lineEUZ = d3.line()
    .x(function(d, i) { return xScale(`${d['Año']}/${d.periodo}`); }) // Valores X
    .y(function(d) { return yScale(d.euz); }) // Valores Y
    .curve(d3.curveMonotoneX) // Aplicar suavizador

    // Crear SVG y agregarlo al body del documento HTML
    var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Crear eje X
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(function(d, i) {
        return (i % 15) === 0 ? d.split('/')[0] : null;
      }));

    // Crear eje Y
    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale));

    // Dibujar linea Union Europea
    svg.append("path")
    .datum(data) // Enlaza datos con la linea
    .attr("class", "line") // Estilos
    .attr("d", lineEU); // Llamar al generador de lineas

    // Dibujar linea Eurozona
    svg.append("path")
    .datum(data) // Enlaza datos con la linea
    .attr("class", "line-euz") // Estilos
    .attr("d", lineEUZ); // Llamar al generador de lineas

    
    // Dibujar circulos Union Europea
    svg.selectAll(".dotEU")
    .data(data)
    .enter().append("circle") // Utiliza append para agregar circulos
    .attr("class", "dot") // Estilos
    .attr("cx", function(d, i) { return xScale(`${d['Año']}/${d.periodo}`) })
    .attr("cy", function(d) { return yScale(d.ue) })
    .attr("r", 5)
    .on("mousemove", mousemoveEU) // Listeners para el tooltip
    .on("mouseleave", mouseleaveEU) // Listeners para el tooltip
    .on("mouseover", mouseoverEU); // Listeners para el tooltip
    
    // Dibujar circulos Eurozona
    svg.selectAll(".dotEUZ")
    .data(data)
    .enter().append("circle") // Utiliza append para agregar circulos
    .attr("class", "dot-euz") // Estilos
    .attr("cx", function(d, i) { return xScale(`${d['Año']}/${d.periodo}`) })
    .attr("cy", function(d) { return yScale(d.euz) })
    .attr("r", 5)
    .on("mousemove", mousemoveEUZ) // Listeners para el tooltip
    .on("mouseleave", mouseleaveEUZ) // Listeners para el tooltip
    .on("mouseover", mouseoverEUZ); // Listeners para el tooltip

    // Leyenda
    svg.append("circle").attr("cx",30).attr("cy",20).attr("r", 6).style("fill", "#8899FF")
    svg.append("circle").attr("cx",30).attr("cy",50).attr("r", 6).style("fill", "#ffab00")
    svg.append("text").attr("x", 50).attr("y", 20).text("Eurozona").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 50).attr("y", 50).text("Union Europea").style("font-size", "15px").attr("alignment-baseline","middle")

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