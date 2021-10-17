d3.csv ("./data/desempleo_ue_y_eurozona.csv").then ( function(datos) {
    //console.log(datos); //Comprobar carga de datos

    window.datosGlobal = datos //Hace global a una determinada variable

    d3.select(".grafico")
        .selectAll('div') //Selección de todos los elemnentos div que se van creando
        .data(datos) //Agrega datos
        .enter() //Conecta los datos con los elementos del DOM
        .append('div') //Agrega un elemento div en cada iteración
        .attr("id", function(d, i) { //Agrega un atributo
            return "a" + i
        })
        .attr("class", function(d) {
            return "value"
        })
        .style( "height", function(d) { //Edita el estilo del div (ancho)
            return (d.ue) * 10 + "px";
        })
        .text( function(d) { //Edita el texto
            return d.ue;
        })
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



//Tabla de datos


//Para mostrar los datos como tabla
d3.csv ("./data/desempleo_ue_y_eurozona.csv").then ( function(datos) {

    var elementoUl = d3.select(".tabla").append('ul');

    elementoUl
        .selectAll('li') //Selección de tantas Li como haga falta
        .data(datos) //Join
        .enter()
        .append('li')
        .text( function(d) {return d.Año})
});

d3.csv ("./data/desempleo_ue_y_eurozona.csv").then ( function(datos) {

    var elementoUl = d3.select(".tabla").append('ul');

    elementoUl
        .selectAll('li') //Selección de tantas Li como haga falta
        .data(datos) //Join
        .enter()
        .append('li')
        .text( function(d) {return d.periodo})
});

d3.csv ("./data/desempleo_ue_y_eurozona.csv").then ( function(datos) {

    var elementoUl = d3.select(".tabla").append('ul');

    elementoUl
        .selectAll('li') //Selección de tantas Li como haga falta
        .data(datos) //Join
        .enter()
        .append('li')
        .text( function(d) {return d.ue + "%"})
});