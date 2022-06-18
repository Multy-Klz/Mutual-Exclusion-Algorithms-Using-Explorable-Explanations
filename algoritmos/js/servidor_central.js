// variaveis do desenho 
var centralServer = d3.select("#scsvg")
    .append("svg")
    .attr("width", 500)
    .attr("height", 200);
var radio = 15, distx, distx2, n1 = 3, x0, y0, x1, y1, chooseInit = 1, rand;
var arrayNodes = [], processQueue = [];
var color = "#E0FF33", line = "RoyalBlue", serverColor = "#2892D7", lineC = "#454545", colorC = "#ffffff"
var tokenProcess = true; // saber se o token está em um processo 
//primeiro desenho 
function drawInit() {
    y0 = 20;
    x0 = 250;
    // função para criar outros processos 
    for (let i = 0; i < n1; i++) {
        if (n1 < 4) {
            distx = 190;
            x1 = distx + i * 60;
            y1 = 150;
        }
        else {
            distx = distx - 30;
            if (i == 0) {
                distx = (n1 - 1) * 30;
                x1 = x0 - distx;
                y1 = 150;
            }
            else {
                x1 = x1 + 60;
                y1 = 150;
            }
        }
        var newNode = { x: x1, y: y1, id: i };
        arrayNodes.push(newNode);
        centralServer.append("line")
            .attr("x1", x0)
            .attr("y1", y0)
            .attr("x2", x1)
            .attr("y2", y1)
            .attr("stroke", lineC)
            .attr("stroke-width", 5)
            .attr("fill", colorC);

        centralServer.append("circle")
            .attr("cx", x1)
            .attr("cy", y1)
            .attr("r", radio)
            .attr("stroke", line)
            .attr("stroke-width", 1)
            .attr("fill", color)
            .append("text")
            .text("P" + i);
    }
    // desenhar o token 
    centralServer.append("circle")
        .attr("class", "token")
        .attr("cx", arrayNodes[chooseInit].x)
        .attr("cy", arrayNodes[chooseInit].y)
        .attr("r", 5)
        .attr("stroke", lineC)
        .attr("fill", colorC);
    // primeiro circulo, esse é o servidor central 
    centralServer.append("circle")
        .attr("cx", x0)
        .attr("cy", y0)
        .attr("r", radio)
        .attr("stroke", line)
        .attr("stroke-width", 1)
        .attr("fill", serverColor);
    // fila de processos 
    centralServer.append("rect")
        .attr("x", 180)
        .attr("y", 180)
        .attr("width", 130)
        .attr("height", 18)
        .attr("stroke", lineC)
        .attr("stroke-width", 1)
        .attr("fill", "transparent");
}
// pra começar o simulador 
function playAlg() {
    d3.select("#buttonsR2").selectAll("button").remove();
    d3.select("#scsvg").selectAll(".token")
        .transition()
        .duration(3500)
        .attr("cx", x0)
        .attr("cy", y0);
    tokenProcess = false;
    chooseInit = -1;

    d3.select("#buttonsR2").append("button")
        .attr("class", "btn btn-rounded btn-light btn-sm")
        .attr("id", "advance")
        .text("Avançar");
    setTimeout(function () {
        d3.select("#buttonsR2").selectAll("#advance")
            .attr("onclick", "advanceAlg()");
    }, 3500)

    d3.select("#buttonsR2").append("button")
        .attr("onclick", "reset()")
        .attr("class", "btn btn-rounded btn-light btn-sm")
        .attr("id", "reset")
        .text("Reset");
}

function advanceAlg() {
    lockAdvance();

    if (processQueue.length != 0) {
        // quando ele esta em um processo, para ele ir pra o servidor central 
        if (tokenProcess) {
            d3.select("#scsvg").selectAll(".token")
            .transition()
            .duration(3500)
            .attr("cx", x0)
            .attr("cy", y0);
            tokenProcess = false;
            setTimeout(function () {
                d3.select("#buttonsR2").selectAll("#advance")
                .attr("onclick", "advanceAlg()");
            }, 3500);
            chooseInit = -1;
        }
        else {
            d3.select("#scsvg").selectAll(".token")
                .transition()
                .duration(3500)
                .attr("cx", processQueue[0].x)
                .attr("cy", processQueue[0].y);
            setTimeout(function () {
                d3.select("#buttonsR2").selectAll("#advance")
                    .attr("onclick", "advanceAlg()");
            }, 3500);
            chooseInit = processQueue[0].id;
            processQueue.shift();
            drawQueue();
            tokenProcess = true;
        }
    }
    else {
        alert("Nenhum processo está solicitando entrar na seção critica");
        d3.select("#buttonsR2").selectAll("#advance")
            .attr("onclick", "advanceAlg()");
    }
}
// bloquear o botão para não ter bugs 
function lockAdvance() {
    d3.select("#buttonsR2").selectAll("#advance")
        .attr("onclick", "");
}
function reset() {
    d3.select("#scsvg").selectAll("circle").remove();
    d3.select("#scsvg").selectAll("text").remove();
    d3.select("#scsvg").selectAll("rect").remove();
    d3.select("#scsvg").selectAll("line").remove();
    d3.select("#scsvg").selectAll(".token").remove();
    d3.select("#buttonsR2").selectAll("button").remove();
    d3.select("#combobox").selectAll("option").remove();
    d3.select("#combobox").selectAll("select").remove();
    arrayNodes.splice(0, 10);
    d3.select("#buttonsR2").append("button")
        .attr("onclick", "playAlg()")
        .attr("class", "btn btn-rounded btn-light btn-sm")
        .text("Play");
    d3.select("#buttonsR2").append("button")
        .attr("onclick", "reset()")
        .attr("class", "btn btn-rounded btn-light btn-sm")
        .attr("id", "reset")
        .text("Reset");
    chooseInit = Math.floor(Math.random() * (Math.floor(n1) - Math.ceil(0))) + 0;
    drawInit();
    if (document.documentElement.scrollTop >= 1500) {

        createComboBox();
        processQueue.splice(0, 10);
        createQueue();
        drawQueue();
    }
    else {
        processQueue.splice(0, 10);
        createQueue();
        drawQueue();
    }
}
// criação da fila aleatoria 
function createQueue() {
    for (let i = 0; i < n1; i++) {
        if (i != chooseInit) {
            rand = Math.floor(Math.random() * (Math.floor(n1) - Math.ceil(0))) + 0;
            if (processQueue != null) {
            }
            while (rand == chooseInit || processQueue.find(element => element.id == rand)) {
                rand = Math.floor(Math.random() * (Math.floor(n1) - Math.ceil(0))) + 0;
            }
            processQueue.push(arrayNodes[rand]);
        }
    }
}

function createCustomQueue() {
    var optionCombobox = comboboxOptions.options[comboboxOptions.selectedIndex].value;
    if (optionCombobox == chooseInit) {
        alert("O processo que já está com o token não pode entrar na fila");
    }
    else {
        if (processQueue != null) {

            if (processQueue.find(element => element.id == optionCombobox)) {
                alert("O processo já está na fila");
            }
            else {
                processQueue.push(arrayNodes[optionCombobox]);
            }
        }
        else {
            alert("Erro na fila");
        }
        drawQueue();
    }
}
// função para tirar um processo da fila 
function removeElementinQueue() {
    var optionFila = comboboxOptions.options[comboboxOptions.selectedIndex].value;
    var index;
    if (optionFila == chooseInit) {
        alert("O processo não está na fila");
    }
    else {
        if (processQueue.find(element => element.id == optionFila)) {
            index = processQueue.findIndex(function (i) {
                return i.id == optionFila;
            })
            processQueue.splice(index, 1);
            drawQueue();
        }
    }
}

function deleteQueue() {
    processQueue.splice(0, 10);
    drawQueue();
}
// desenhar processo na fila 
function drawQueue() {
    d3.select("#scsvg").selectAll(".filaprocesso").remove();
    for (let i = 0; i < processQueue.length; i++) {
        distx2 = 182 + i * 18;
        centralServer.append("text")
            .attr("class", "filaprocesso")
            .attr("x", distx2)
            .attr("y", 192)
            .text("P" + processQueue[i].id)
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("fill", lineC);
    }
}
// mudar o token de processo 
function addPToken() {
    var optionToken = comboboxOptions.options[comboboxOptions.selectedIndex].value;
    if (processQueue.find(element => element.id == optionToken)) {
        alert("O processo deve ser retirado da fila primeiro");
    }
    else {
        chooseInit = optionToken;
        d3.select("#scsvg").selectAll(".token")
            .attr("cx", arrayNodes[chooseInit].x)
            .attr("cy", arrayNodes[chooseInit].y);
    }
}
// função para resetar o desenho quando mudar o slider 
function changeDrawing() {
    d3.select("#scsvg").selectAll("circle").remove();
    d3.select("#scsvg").selectAll("text").remove();
    d3.select("#scsvg").selectAll("rect").remove();
    d3.select("#scsvg").selectAll("line").remove();
    d3.select("#scsvg").selectAll(".token").remove();
    d3.select("#buttonsR2").selectAll("button").remove();
    d3.select("#combobox").selectAll("option").remove();
    d3.select("#combobox").selectAll("select").remove();
    chooseInit = Math.floor(Math.random() * (Math.floor(n1) - Math.ceil(0))) + 0;
    drawInit();
    createComboBox();
    processQueue.splice(0, 10);
    createQueue();
    drawQueue();
    d3.select("#buttonsR2").append("button")
        .attr("onclick", "playAlg()")
        .attr("class", "btn btn-rounded btn-light btn-sm")
        .text("Play");
}

function showProcessName() {
    for (let i = 0; i < n1; i++) {
        centralServer.append("rect")
            .attr("x", arrayNodes[i].x - 8)
            .attr("y", arrayNodes[i].y + 7)
            .attr("class", "nome")
            .attr("width", 16)
            .attr("height", 15)
            .attr("stroke", lineC)
            .attr("stroke-width", 1)
            .attr("fill", colorC);
        centralServer.append("text")
            .attr("x", arrayNodes[i].x - 8)
            .attr("y", arrayNodes[i].y + 17)
            .attr("class", "nome")
            .text("P" + i)
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("fill", lineC);
    }
}
// voltar para o estado inicial, sem os nomes dos processos 
function unshowProcessName() {
    d3.select("#scsvg").selectAll(".nome").remove();
}

// função para utilizar o slide, para mudar o desenho 
var slider = document.getElementById("sliderNodePart");
slider.oninput = function () {
    arrayNodes.splice(0, 10);
    n1 = this.value;
    changeDrawing();
}
// inicialização da tela 
window.onload = function () {
    drawInit();
    createQueue();
    drawQueue();
    drawExample();
}

window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
    
    if (isVisible(p) == true) {
        document.getElementById("buttons").style.display = "flex";
        d3.select("#combobox").selectAll("option").remove();
        d3.select("#combobox").selectAll("select").remove();
        createComboBox();
    }
    else {
        document.getElementById("buttonsR2").style.display = "block";
        document.getElementById("buttons").style.display = "none";
    }
}

const p = document.querySelector("#transition");
function isVisible(el) {
    const positions = el.getBoundingClientRect();
    const begin = positions.top;
    const end = positions.bottom;
    let isVisible = false

    if ((begin >= 0) && (end <= (window.innerHeight) - 200)) {
        isVisible = true;
    }
    return isVisible;
}

var comboboxOptions = document.getElementById("combobox");
function createComboBox() {
    for (let i = 0; i < n1; i++) {
        comboboxOptions.options[comboboxOptions.options.length] = new Option('Processo ' + arrayNodes[i].id,  i);
    }
}
// quando o usuário cliclar volta para o topo
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
// variaveis do desenho exemplo //
var example = d3.select("#firstsvg")
    .append("svg")
    .attr("width", 500)
    .attr("height", 200);
var distx0, distx02, examplex0 = 250, exampley0 = 20, examplex1, exampley1;
var colorToken = "#5C40DB", colorProcess = "#4089DC", colorCentral = "#FF4A4A", colorQueue = "#16C172"
var examplesNodes = [];

function drawExample() {
    for (let i = 0; i < 3; i++) {
        distx0 = 190;
        examplex1 = distx0 + i * 60;
        exampley1 = 150;
        var newNode = { x: examplex1, y: exampley1, id: i };
        examplesNodes.push(newNode);
        example.append("line")
            .attr("x1", examplex0)
            .attr("y1", exampley0)
            .attr("x2", examplex1)
            .attr("y2", exampley1)
            .attr("stroke", lineC)
            .attr("stroke-width", 5)
            .attr("fill", colorC);

        example.append("circle")
            .attr("cx", examplex1)
            .attr("cy", exampley1)
            .attr("class", "processos")
            .attr("r", radio)
            .attr("stroke", line)
            .attr("stroke-width", 1)
            .attr("fill", color)
            .append("text")
            .text("P" + i);
    }
    
    example.append("circle")
        .attr("class", "token")
        .attr("cx", examplesNodes[0].x)
        .attr("cy", examplesNodes[0].y)
        .attr("r", 5)
        .attr("stroke", lineC)
        .attr("fill", colorC);
    
    example.append("circle")
        .attr("class", "central")
        .attr("cx", examplex0)
        .attr("cy", exampley0)
        .attr("r", radio)
        .attr("stroke", line)
        .attr("stroke-width", 1)
        .attr("fill", serverColor);
    
    example.append("rect")
        .attr("class", "fila")
        .attr("x", 180)
        .attr("y", 180)
        .attr("width", 130)
        .attr("height", 18)
        .attr("stroke", lineC)
        .attr("stroke-width", 1)
        .attr("fill", "transparent");
}
function showCentral() {
    d3.select("#firstsvg").selectAll(".central")
        .transition()
        .duration(400)
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", colorCentral)
                .style("stroke-width", 1)
                .transition()
                .style("stroke", colorCentral)
                .style("stroke-width", 4)
                .on("start", repeat);
        })

    example.append("rect")
        .attr("x", 110)
        .attr("y", 15)
        .attr("class", "ajuda")
        .attr("width", 90)
        .attr("height", 18)
        .attr("stroke", lineC)
        .attr("stroke-width", 1)
        .attr("fill", "transparent");
    example.append("text")
        .attr("x", 112)
        .attr("y", 28)
        .attr("class", "ajuda")
        .text("Servidor Central")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", lineC);
    example.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("class", "ajuda")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");
    example.append("line")
        .attr("class", "ajuda")
        .attr("x1", 234)
        .attr("y1", 23)
        .attr("x2", 200)
        .attr("y2", 23)
        .attr("stroke", lineC)
        .attr("stroke-width", 1)
        .attr("marker-start", "url(#arrow)");
}
function unshowCentral() {
    d3.select("#firstsvg").selectAll(".central")
        .transition()
        .duration(700)
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", line)
                .style("stroke-width", 1)
                .on("start", repeat);
        })
    d3.select("#firstsvg").selectAll(".ajuda").remove();
}
function showProcess() {
    d3.select("#firstsvg").selectAll(".processos")
        .transition()
        .duration(400)
        .delay(function (d, i) { return i * 50; })
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", colorProcess)
                .style("stroke-width", 1)
                .transition()
                .style("stroke", colorProcess)
                .style("stroke-width", 4)
                .on("start", repeat);
        })

    example.append("rect")
        .attr("x", 370)
        .attr("y", 145)
        .attr("class", "ajuda")
        .attr("width", 60)
        .attr("height", 18)
        .attr("stroke", lineC)
        .attr("stroke-width", 1)
        .attr("fill", "transparent");
    example.append("text")
        .attr("x", 372)
        .attr("y", 158)
        .attr("class", "ajuda")
        .text("Processos")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", lineC);
    example.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("class", "ajuda")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");
    example.append("line")
        .attr("class", "ajuda")
        .attr("x1", 330)
        .attr("y1", 153)
        .attr("x2", 370)
        .attr("y2", 153)
        .attr("stroke", lineC)
        .attr("stroke-width", 1)
        .attr("marker-start", "url(#arrow)");
}
function unshowProcess() {
    d3.select("#firstsvg").selectAll(".processos")
        .transition()
        .duration(700)
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", colorProcess)
                .style("stroke-width", 1)
                .on("start", repeat);
        })
    d3.select("#firstsvg").selectAll(".ajuda").remove();
}
function showToken() {
    d3.select("#firstsvg").selectAll(".token")
        .transition()
        .duration(1500)
        .attr("fill", colorToken);
    example.append("rect")
        .attr("x", 110)
        .attr("y", 141)
        .attr("class", "ajuda")
        .attr("width", 37)
        .attr("height", 18)
        .attr("stroke", lineC)
        .attr("stroke-width", 1)
        .attr("fill", "transparent");
    example.append("text")
        .attr("x", 112)
        .attr("y", 154)
        .attr("class", "ajuda")
        .text("Token")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", lineC);
    example.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("class", "ajuda")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");
    example.append("line")
        .attr("class", "ajuda")
        .attr("x1", 182)
        .attr("y1", 149)
        .attr("x2", 147)
        .attr("y2", 149)
        .attr("stroke", lineC)
        .attr("stroke-width", 1)
        .attr("marker-start", "url(#arrow)");
}
function unshowToken() {
    d3.select("#firstsvg").selectAll(".token")
        .transition()
        .duration(1500)
        .attr("fill", colorC);
    d3.select("#firstsvg").selectAll(".ajuda").remove();
}
function showQueue() {
    d3.select("#firstsvg").selectAll(".fila")
        .transition()
        .duration(500)
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", colorQueue)
                .style("stroke-width", 1)
                .transition()
                .style("stroke", colorQueue)
                .style("stroke-width", 4)
                .on("start", repeat);
        });
    example.append("rect")
        .attr("x", 60)
        .attr("y", 180)
        .attr("class", "ajuda")
        .attr("width", 96)
        .attr("height", 18)
        .attr("stroke", lineC)
        .attr("stroke-width", 1)
        .attr("fill", "transparent");
    example.append("text")
        .attr("x", 60)
        .attr("y", 193)
        .attr("class", "ajuda")
        .text("Fila de processos")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", lineC);
    example.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("class", "ajuda")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");
    example.append("line")
        .attr("class", "ajuda")
        .attr("x1", 182)
        .attr("y1", 188)
        .attr("x2", 157)
        .attr("y2", 188)
        .attr("stroke", lineC)
        .attr("stroke-width", 1)
        .attr("marker-start", "url(#arrow)");
}
function unshowQueue() {
    d3.select("#firstsvg").selectAll(".fila")
        .transition()
        .duration(700)
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", lineC)
                .style("stroke-width", 1)
                .on("start", repeat);
        })
    d3.select("#firstsvg").selectAll(".ajuda").remove();
}
