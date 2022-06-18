var ring = d3.select("#ringsvg")
    .append("svg")
    .attr("width", 300)
    .attr("height", 300);

var radio = 15, angle, n1 = 3, x1, y1, x2, y2;
var arrayNodes = [];
var tokenProcess = false;
var normalColor = "#2892D7", line = "RoyalBlue";
var usingColor = "#FF9F1C", requestColor = "#009933";
var lineC = "#000000", colorC = "#ffffff";
var positionToken = 0;
var rand;

function drawInit() {
    positionToken = 0;
    for (let i = 0; i < n1; i++) {
        angle = 2 * Math.PI * i / n1;
        x1 = Math.cos(angle) * 103 + 130;
        y1 = Math.sin(angle) * 103 + 130;
        angle = angle + (Math.PI / 2);

        var newNode = { x: x1, y: y1, id: i, angle, tokenProcess: tokenProcess };
        arrayNodes.push(newNode);

    }
    for (let i = 0; i < n1; i++) {
        if (i === arrayNodes.length - 1) {
            var arc = d3.arc()
                .innerRadius(102.5)
                .outerRadius(103.5)
                .startAngle(arrayNodes[0].angle + (2 * Math.PI))
                .endAngle(arrayNodes[i].angle);
        }
        else {
            var arc = d3.arc()
                .innerRadius(102.5)
                .outerRadius(103.5)
                .startAngle(arrayNodes[i + 1].angle)
                .endAngle(arrayNodes[i].angle);
        }
        ring.append("path")
            .attr("d", arc)
            .attr("transform", "translate(130, 130)");
    }
    for (let i = 0; i < n1; i++) {
        ring.append("circle")
            .attr("cx", arrayNodes[i].x)
            .attr("cy", arrayNodes[i].y)
            .attr("r", radio)
            .attr("stroke", line)
            .attr("stroke-width", 1)
            .attr("fill", normalColor)
            .attr("class", "P" + i);
        ring.append("rect")
            .attr("x", arrayNodes[i].x - 8)
            .attr("y", arrayNodes[i].y + 6)
            .attr("width", 16)
            .attr("height", 15)
            .attr("stroke", lineC)
            .attr("stroke-width", 1)
            .attr("fill", colorC);
        ring.append("text")
            .attr("x", arrayNodes[i].x - 6)
            .attr("y", arrayNodes[i].y + 17)
            .text("P" + i)
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", lineC);
    }
    ring.append("circle")
        .attr("class", "token0")
        .attr("cx", arrayNodes[0].x)
        .attr("cy", arrayNodes[0].y)
        .attr('r', 5)
        .attr('fill', colorC)
        .attr("stroke", lineC);
}

function playAlg() {
    d3.select("#ringsvg").selectAll(".token0").remove();
    if (!arrayNodes[positionToken].processoToken) {

        d3.select("#ringsvg").selectAll(".P" + positionToken)
            .transition()
            .duration(500)
            .attr("fill", normalColor);
    }
    if (positionToken === arrayNodes.length - 1) {
        var dataArc = [
            { startAngle: arrayNodes[positionToken].angle, endAngle: arrayNodes[0].angle + (2 * Math.PI) },
        ];
        positionToken = 0;
    }
    else {
        var dataArc = [
            { startAngle: arrayNodes[positionToken].angle, endAngle: arrayNodes[positionToken + 1].angle },
        ];
        positionToken++;
    }

    var arc = d3.arc().outerRadius(103.5).innerRadius(103.5);

    var path = ring.append("g")
        .selectAll("path.arc")
        .data(dataArc);

    path.enter()
        .append('circle')
        .attr("transform", `translate(${arrayNodes[0].x - 103},${arrayNodes[0].y})`)
        .attr('opacity', 0)
        .attr("class", "token")
        .attr('r', 5)
        .attr('fill', colorC)
        .attr("stroke", lineC)
        .transition()
        .delay(0)
        .duration(3000)
        .attrTween("pathTween", function (d) {
            const startAngle = d.startAngle;
            const endAngle = d.endAngle;
            const start = { startAngle, endAngle: startAngle } // <-A
            const end = { startAngle: endAngle, endAngle }
            const interpolate = d3.interpolate(start, end); // <-B
            const circ = d3.select(".token") // Select the circle
            return function (t) {
                const cent = arc.centroid(interpolate(t)); // <-C         
                //return cent[0]
                circ
                    .attr('opacity', 1)
                    .attr("cx", cent[0]) // Set the cx
                    .attr("cy", cent[1]) // set the cy
            };
        })
    if (arrayNodes[positionToken].processoToken) {
        setTimeout(function () {
            d3.select("#ringsvg").selectAll(".P" + positionToken)
                .transition()
                .duration(1000)
                .attr("fill", usingColor); // está usando a seção critica //
        }, 3000);
        arrayNodes[positionToken].processoToken = false;
    }
    if (estaVisivel(p) == false) {
        setTimeout(callRandom(), 3000);
    }
}

function callRandom() {
    rand = Math.floor(Math.random() * (Math.floor(n1) - Math.ceil(0))) + 0;
    for (let i = 0; i < rand; i++) {
        rand = Math.floor(Math.random() * (Math.floor(n1) - Math.ceil(0))) + 0;
        if (rand == positionToken || arrayNodes[rand].processoToken == true) {
        }
        else {
            
            arrayNodes[rand].processoToken = true; // quer entrar na seção critica //

            d3.select("#ringsvg").selectAll(".P" + rand)
                .transition()
                .delay(250)
                .duration(2000)
                .attr("fill", requestColor);
        }
    }
}

function requestToken() {
    var optionToken = comboboxOptions.options[comboboxOptions.selectedIndex].value;
    if (optionToken == positionToken) {
        alert("O processo que já está com o token não pode solicitar");
    }
    else {
        if (arrayNodes[optionToken].processoToken) {
            alert("O processo já solicitou");
        }
        else {
            arrayNodes[optionToken].processoToken = true;
            d3.select("#ringsvg").selectAll(".P" + optionToken)
                .transition()
                .delay(250)
                .duration(2000)
                .attr("fill", requestColor);
        }
    }
}

function withdrawToken() {
    var optionToken = comboboxOptions.options[comboboxOptions.selectedIndex].value;
    if (optionToken == positionToken) {
        alert("O processo que já está com o token não pode ser revogado o acesso");
    }
    else {
        if (!arrayNodes[optionToken].processoToken) {
            alert("Esse processo não solicitou ainda");
        }
        else {
            arrayNodes[optionToken].processoToken = false;
            d3.select("#ringsvg").selectAll(".P" + optionToken)
                .transition()
                .delay(250)
                .duration(2000)
                .attr("fill", normalColor);
        }
    }
}

var slider1 = document.getElementById("sliderNodePart");
slider1.oninput = function () {
    arrayNodes.splice(0, 10);
    n1 = this.value;
    reset();
    drawInit();
}

function reset() {
    d3.select("#ringsvg").selectAll("circle").remove();
    d3.select("#ringsvg").selectAll("text").remove();
    d3.select("#ringsvg").selectAll("rect").remove();
    d3.select("#ringsvg").selectAll("line").remove();
    d3.select("#ringsvg").selectAll(".token").remove();
}

window.onload = function () {
    drawInit();
    document.getElementById("buttonsR2").style.display = "block";
    drawExample();
}

window.onscroll = function () { scrollFunction() };
function scrollFunction() {

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
    // troca de desenho //
    if (estaVisivel(p) == true) {
        document.getElementById("buttons").style.display = "flex";
        d3.select("#combobox").selectAll("option").remove();
        d3.select("#combobox").selectAll("select").remove();
        criarComboBox();
    }
    else {
        document.getElementById("buttons").style.display = "none";
    }
}

const p = document.querySelector("#transition");
function estaVisivel(el) {
    const posicoes = el.getBoundingClientRect();
    const inicio = posicoes.top;
    const fim = posicoes.bottom;
    let estaVisivel = false

    if ((inicio >= 0) && (fim <= (window.innerHeight) - 200)) {
        estaVisivel = true;
    }
    return estaVisivel;
}
// quando o usuário cliclar volta para o topo
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

var comboboxOptions = document.getElementById("combobox");
function criarComboBox() {
    for (let i = 0; i < n1; i++) {
        comboboxOptions.options[comboboxOptions.options.length] = new Option(arrayNodes[i].id, i);
    }
}

var example = d3.select("#firstsvg")
    .append("svg")
    .attr("width", 500)
    .attr("height", 300);
var x01, y01;
var colorToken = "#4B0082", colorProcesso = "#e13138"
var nodesZero = [];
function drawExample() {
    for (let i = 0; i < 3; i++) {
        angle = 2 * Math.PI * i / 3;
        x01 = Math.cos(angle) * 103 + 250;
        y01 = Math.sin(angle) * 103 + 130;
        angle = angle + (Math.PI / 2);

        var newNode = { x: x01, y: y01, id: i, angle };
        nodesZero.push(newNode);

    }
    for (let i = 0; i < 3; i++) {
        if (i === nodesZero.length - 1) {
            var arc = d3.arc()
                .innerRadius(102.5)
                .outerRadius(103.5)
                .startAngle(nodesZero[0].angle + (2 * Math.PI))
                .endAngle(nodesZero[i].angle);
        }
        else {
            var arc = d3.arc()
                .innerRadius(102.5)
                .outerRadius(103.5)
                .startAngle(nodesZero[i + 1].angle)
                .endAngle(nodesZero[i].angle);
        }
        example.append("path")
            .attr("d", arc)
            .attr("transform", "translate(250, 130)");
    }
    for (let i = 0; i < 3; i++) {
        example.append("circle")
            .attr("cx", nodesZero[i].x)
            .attr("cy", nodesZero[i].y)
            .attr("r", radio)
            .attr("stroke", line)
            .attr("stroke-width", 1)
            .attr("fill", normalColor)
        example.append("rect")
            .attr("x", nodesZero[i].x - 8)
            .attr("y", nodesZero[i].y + 6)
            .attr("width", 16)
            .attr("height", 15)
            .attr("stroke", lineC)
            .attr("stroke-width", 1)
            .attr("fill", colorC);

        example.append("text")
            .attr("x", nodesZero[i].x - 6)
            .attr("y", nodesZero[i].y + 17)
            .text("P" + i)
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", lineC);
    }
    example.append("circle")
        .attr("cx", nodesZero[0].x)
        .attr("cy", nodesZero[0].y)
        .attr('r', 5)
        .attr('fill', colorC)
        .attr("stroke", lineC);
}
var normal = d3.select("#normal")
    .append("svg")
    .attr("width", 49)
    .attr("height", 30);
var request = d3.select("#request")
    .append("svg")
    .attr("width", 39)
    .attr("height", 30);
var using = d3.select("#using")
    .append("svg")
    .attr("width", 21)
    .attr("height", 30);
normal.append("circle")
    .attr("cx", 37)
    .attr("cy", 22.5)
    .attr("r", 7)
    .attr("stroke", line)
    .attr("stroke-width", 1)
    .attr("fill", normalColor)
request.append("circle")
    .attr("cx", 27)
    .attr("cy", 22.5)
    .attr("r", 7)
    .attr("stroke", line)
    .attr("stroke-width", 1)
    .attr("fill", requestColor)
using.append("circle")
    .attr("cx", 10)
    .attr("cy", 22.5)
    .attr("r", 7)
    .attr("stroke", line)
    .attr("stroke-width", 1)
    .attr("fill", usingColor)
