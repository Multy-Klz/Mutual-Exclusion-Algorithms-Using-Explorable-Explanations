var multicast = d3.select("#multicastsvg")
    .append("svg")
    .attr("width", 400)
    .attr("height", 250)
var x0 = 20, y0 = 10, tx = 97, ty = 30;
var idProcess;
var red = "#D60000";
var lineC = "#000";
var arrayNodes = [];
var messageData = ["RELEASED", "WANTED", "HELD"];
var clock = 0;
var ini = -1;
var operation = "SEND";

function drawInit() {
    idProcess = 0;
    for (let i = 0; i < 2; i++) {
        y0 = y0 + i * 160;
        x0 = 20;
        for (let j = 0; j < 2; j++) {
            clockRandom();
            x0 = x0 + j * 250;
            // reta para identificar qual processo está no momento da execução 
            multicast.append("rect")
                .attr("class", "posicao" + idProcess)
                .attr("style", "fill:#fff")
                .attr("stroke", "#000")
                .attr("x", x0)
                .attr("y", y0)
                .attr("width", tx + 24)
                .attr("height", ty + ty + 0.2);
            // bloco do nome do processo //
            multicast.append("rect")
                .attr("style", "fill:pink")
                .attr("x", x0)
                .attr("y", y0)
                .attr("width", tx)
                .attr("height", ty)
                .attr("stroke", "#000");
            multicast.append("text")
                .attr("x", x0 + 30)
                .attr("y", y0 + 22)
                .text("P" + idProcess)
                .attr("font-family", "sans-serif")
                .attr("font-size", "17px")
                .attr("fill", "#000");
            //relogio //
            multicast.append("text")
                .attr("x", x0 + 50)
                .attr("y", y0 + 22)
                .attr("class", "P" + idProcess)
                .text("[" + clock + "]")
                .attr("font-family", "sans-serif")
                .attr("font-size", "17px")
                .attr("fill", "#000");
            // mensagem //
            multicast.append("rect")
                .attr("style", "fill:#2892D7")
                .attr("x", x0)
                .attr("y", y0 + 30.2)
                .attr("width", tx)
                .attr("height", ty)
                .attr("stroke", "#000");
            multicast.append("text")
                .attr("x", x0 + 2)
                .attr("y", y0 + 52)
                .attr("class", "M" + idProcess)
                .text(messageData[0])
                .attr("font-family", "sans-serif")
                .attr("font-size", "17px")
                .attr("fill", "#000000");
            // fila//
            multicast.append("rect")
                .attr("style", "fill:#7B7B7B")
                .attr("stroke", "#000")
                .attr("x", x0 + 96)
                .attr("y", y0)
                .attr("width", 25)
                .attr("height", ty + ty + 0.2);

            var queue = [];
            var newNode = { id: idProcess, x: x0, y: y0, message: messageData[0], processQueue: queue, clock };
            arrayNodes.push(newNode);
            idProcess++;
        }
        x0 = 0;
    }
}
// inicialização dos relogios aleatorios 
function clockRandom() {
    var count; // variavel de contagem dos processo que estão com relogios 
    if (clock != 0) { // relogio não pode ser zero
        do {
            rand = Math.floor(Math.random() * (Math.floor(30) - Math.ceil(0))) + 1;
            count = 0;
            for (let k = 0; k < idProcess; k++) {
                if (arrayNodes[k].clock == rand) {
                    count--;
                }
                else {
                    count++;
                }
            }
        } while (count != idProcess) // se ver for igual a p é porque todos os processos tem relogios diferentes
    }
    else {
        // primeiro processo a receber o relogio aleatório 
        rand = Math.floor(Math.random() * (Math.floor(30) - Math.ceil(0))) + 1;
    }
    clock = rand;
}
// colocar pelo menos 1 wanted nos processos 
function playRand() {
    reset();
    var chooseP;
    let countReleased = 0;
    for (let i = 0; i < 4; i++) {
        if (i == 0) {
            chooseP = Math.floor(Math.random() * (Math.floor(4) - Math.ceil(0))) + 0;
            do {
                rand = Math.floor(Math.random() * (Math.floor(3) - Math.ceil(0))) + 0;
            } while (rand == 2)
            if (rand == 0) { // se rand for zero vai RELEASED // 
                arrayNodes[chooseP].message = messageData[0];
                countReleased++;
            }
            else {
                arrayNodes[chooseP].message = messageData[1];
                d3.select("#multicastsvg").selectAll(".M" + chooseP)
                    .transition()
                    .delay(250)
                    .duration(8000)
                    .text(arrayNodes[chooseP].message);
            }
        }
        else {
            do {
                rand = Math.floor(Math.random() * (Math.floor(4) - Math.ceil(0))) + 0;
            } while (chooseP == rand)
            chooseP = rand;
            do {
                rand = Math.floor(Math.random() * (Math.floor(3) - Math.ceil(0))) + 0;
            } while (rand == 2)
            if (rand == 0) {
                arrayNodes[chooseP].message = messageData[0];
                d3.select("#multicastsvg").selectAll(".M" + chooseP)
                    .transition()
                    .delay(250)
                    .duration(8000)
                    .text(arrayNodes[chooseP].message);
                countReleased++;
            }
            else {
                arrayNodes[chooseP].message = messageData[1];
                d3.select("#multicastsvg").selectAll(".M" + chooseP)
                    .transition()
                    .delay(250)
                    .duration(8000)
                    .text(arrayNodes[chooseP].message);
            }
        }
    }
    if (countReleased == 4) {
        playRand();
    }
    ini = 0;
    operation = "SEND";
}
// função para escolher pelo menos 1 HELD //
function playRand2(e) {
    reset();
    var chooseP;
    let held = e;
    var chooseHeld; // variavel que escolhe processo está com HELD//
    let released = 0; // contagem de released, não pode ter 3 //
    for (let i = 0; i < 4; i++) {
        if (i == 0) {
            chooseHeld = Math.floor(Math.random() * (Math.floor(4) - Math.ceil(0))) + 0;
            chooseP = chooseHeld;
            arrayNodes[chooseHeld].message = messageData[2];
            d3.select("#multicastsvg").selectAll(".M" + chooseHeld)
                .transition()
                .delay(250)
                .duration(8000)
                .text(arrayNodes[chooseHeld].message);
            held++;
        }
        else {
            do {
                rand = Math.floor(Math.random() * (Math.floor(4) - Math.ceil(0))) + 0;
            } while (chooseP == rand || chooseHeld == rand)
            chooseP = rand;
            do {
                rand = Math.floor(Math.random() * (Math.floor(3) - Math.ceil(0))) + 0;
            } while (rand == 2)
            if (rand == 0) {
                arrayNodes[chooseP].message = messageData[0];
                d3.select("#multicastsvg").selectAll(".M" + chooseP)
                    .transition()
                    .delay(250)
                    .duration(8000)
                    .text(arrayNodes[chooseP].message);
                released++;
            }
            else {
                arrayNodes[chooseP].message = messageData[1];
                d3.select("#multicastsvg").selectAll(".M" + chooseP)
                    .transition()
                    .delay(250)
                    .duration(8000)
                    .text(arrayNodes[chooseP].message);
            }
        }
    }
    if (released == 3 || held > 1) {
        playRand2();
    }
    ini = 0;
    operation = "SEND";
}

function reset() {
    ini = -1;
    d3.select("#multicastsvg").selectAll(".bloco").remove();
    d3.select("#multicastsvg").selectAll(".mensagem").remove();
    clock = 0; // para inicializar a função clockRandom()
    for (let i = 0; i < arrayNodes.length; i++) {
        d3.select("#multicastsvg").selectAll(".P" + i).remove();
        d3.select("#multicastsvg").selectAll(".M" + i).remove();
        d3.select("#multicastsvg").selectAll(".filaprocesso" + i).remove();
        unShowLastProcess(i);
    }
    for (let i = 0; i < arrayNodes.length; i++) {
        clockRandom();
        arrayNodes[i].clock = clock;
        arrayNodes[i].message = messageData[0];
        arrayNodes[i].processQueue.splice(0, 10);
        document.getElementById("relogio" + i).value = arrayNodes[i].clock;
        multicast.append("text")
            .attr("x", arrayNodes[i].x + 50)
            .attr("y", arrayNodes[i].y + 22)
            .attr("class", "P" + i)
            .text("[" + clock + "]")
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000");
        multicast.append("text")
            .attr("x", arrayNodes[i].x + 2)
            .attr("y", arrayNodes[i].y + 52)
            .attr("class", "M" + i)
            .text(messageData[0])
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");

    }
}

function playAlg() {
  
    if (ini == 4) {
        ini = 0;
    }
    d3.select("#multicastsvg").selectAll(".bloco").remove();
    d3.select("#multicastsvg").selectAll(".mensagem").remove();
    // primeiro apertar//
    if (ini == -1) {
        alert("É preciso escolher um CENÁRIO antes de AVANÇAR");
    }
    else {
        if (ini == 0) unShowLastProcess(3);
        unShowLastProcess(ini - 1)
        showCurrentProcess(ini);
        if (operation == "RESP" && arrayNodes[ini].message == messageData[1]) {
            if (analyzeAccess(arrayNodes[ini]) == 3) {
                arrayNodes[ini].message = messageData[2];
                updateStatus(ini);
            }
            ini++;
            operation = "SEND";
        }
        else {
            if (operation == "SEND") {
                if (arrayNodes[ini].message == messageData[1]) {
                    broadcast(arrayNodes[ini]);
                    operation = "RESP"; //var para controle de resposta
                }

                if (arrayNodes[ini].message == messageData[2]) {
                    heldBroadcast(arrayNodes[ini]);
                    arrayNodes[ini].message = messageData[0];
                    updateStatus(ini);
                    unlockAccess(arrayNodes[ini]);
                }
                if (arrayNodes[ini].message == messageData[0]) {
                    ini++;
                }
            }
        }
    }
}
// descobrir as mensagens dos outros processo e retornar o acesso //
function analyzeAccess(requesterProcess) {
    var access = 0; //respostas //
    for (let i = 0; i < arrayNodes.length; i++) {
        if (requesterProcess.id != arrayNodes[i].id) {
            if (arrayNodes[i].message == messageData[0]) {
                access++;
                drawMessage(arrayNodes[i], requesterProcess);
            } else {
                if (arrayNodes[i].message == messageData[2]) {
                    if (arrayNodes[i].processQueue.find(element => element == requesterProcess.id) == undefined) {
                        arrayNodes[i].processQueue.push(requesterProcess.id);
                        drawQueue(arrayNodes[i]);
                    }

                } else {
                    if (arrayNodes[i].message == messageData[1]) {
                        if (arrayNodes[i].clock > requesterProcess.clock) {
                            access++;
                            drawMessage(arrayNodes[i], requesterProcess);
                        }
                    }
                }
            }
        }
    }
    return access;
}
//desenho da seta P2P
function drawMessage(process1, process2) {
    d3.select("#multicastsvg").selectAll(".bloco").remove();
    if (process1.id == 0 && process2.id == 1 || (process1.id == 2 && process2.id == 3)) {
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "mensagem")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", process2.x)
            .attr("y1", process2.y + 30)
            .attr("x2", process1.x + tx + 25)
            .attr("y2", process1.y + 30)
            .attr("class", "mensagem")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
    if (process1.id == 0 && process2.id == 2 || (process1.id == 1 && process2.id == 3)) {
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "mensagem")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", process2.x + (tx / 2))
            .attr("y1", process2.y)
            .attr("x2", process1.x + (tx / 2))
            .attr("y2", process1.y + 2 * ty)
            .attr("class", "mensagem")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
    if (process1.id == 0 && process2.id == 3) {
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "mensagem")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", process2.x)
            .attr("y1", process2.y)
            .attr("x2", process1.x + tx + 25)
            .attr("y2", process1.y + 2 * ty)
            .attr("class", "mensagem")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
    if (process1.id == 1 && process2.id == 0 || (process1.id == 3 && process2.id == 2)) {
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "mensagem")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", process2.x + tx + 25)
            .attr("y1", process2.y + 30)
            .attr("x2", process1.x)
            .attr("y2", process1.y + 30)
            .attr("class", "mensagem")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
    if (process1.id == 1 && process2.id == 2) {
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "mensagem")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", process2.x + tx + 25)
            .attr("y1", process2.y)
            .attr("x2", process1.x)
            .attr("y2", process1.y + 2 * ty)
            .attr("class", "mensagem")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
    if (process1.id == 2 && process2.id == 0 || (process1.id == 3 && process2.id == 1)) {
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "mensagem")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", process2.x + (tx / 2))
            .attr("y1", process2.y + 2 * ty)
            .attr("x2", process1.x + (tx / 2))
            .attr("y2", process1.y)
            .attr("class", "mensagem")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
    if (process1.id == 2 && process2.id == 1) {
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "mensagem")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", process2.x)
            .attr("y1", process2.y + 2 * ty)
            .attr("x2", process1.x + tx + 25)
            .attr("y2", process1.y)
            .attr("class", "mensagem")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
    if (process1.id == 3 && process2.id == 0) {
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "mensagem")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", process2.x + tx + 25)
            .attr("y1", process2.y + 2 * ty)
            .attr("x2", process1.x)
            .attr("y2", process1.y)
            .attr("class", "mensagem")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
}

function drawQueue(process) {
    d3.select("#multicastsvg").selectAll(".filaprocesso" + process.id).remove();
    var disty = process.y + 2 * ty;
    for (let i = 0; i < process.processQueue.length; i++) {
        disty -= 1.2 + 20;
        multicast.append("rect")
            .attr("class", "filaprocesso" + process.id)
            .attr("style", "fill:white")
            .attr("x", process.x + tx + 1)
            .attr("y", disty + 4)
            .attr("width", 20)
            .attr("height", 18)
            .attr("stroke", "#000");
        multicast.append("text")
            .attr("class", "filaprocesso" + process.id)
            .attr("x", process.x + tx + 2)
            .attr("y", disty + 16)
            .text("P" + process.processQueue[i])
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("fill", lineC);
    }
}

function updateStatus(idProcess) {
    d3.select("#multicastsvg").selectAll(".M" + idProcess)
        .transition()
        .delay(1000)
        .text(arrayNodes[idProcess].message);
}
// função que envia mensagem para todos os outros processos, a partir do solicitante //
function broadcast(requesterProcess) {
    if (requesterProcess.id == 0) {
        multicast.append("rect")
            .attr("x", requesterProcess.x + tx + 50)
            .attr("y", requesterProcess.y)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", requesterProcess.x + tx + 55)
            .attr("y", requesterProcess.y + 16)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[1].x)
            .attr("y1", arrayNodes[1].y + 30)
            .attr("x2", requesterProcess.x + tx + 25)
            .attr("y2", requesterProcess.y + 30)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
        // proximo processo //
        multicast.append("rect")
            .attr("x", requesterProcess.x + (tx / 2) + 5)
            .attr("y", arrayNodes[2].y - 60)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", requesterProcess.x + (tx / 2) + 10)
            .attr("y", arrayNodes[2].y - 44)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[2].x + (tx / 2))
            .attr("y1", arrayNodes[2].y)
            .attr("x2", requesterProcess.x + (tx / 2))
            .attr("y2", requesterProcess.y + 2 * ty)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");

        multicast.append("rect")
            .attr("x", requesterProcess.x + tx + 80)
            .attr("y", arrayNodes[3].y - 78)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", requesterProcess.x + tx + 85)
            .attr("y", arrayNodes[3].y - 62)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[3].x)
            .attr("y1", arrayNodes[3].y)
            .attr("x2", requesterProcess.x + tx + 25)
            .attr("y2", requesterProcess.y + 2 * ty)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
    if (requesterProcess.id == 1) {
        multicast.append("rect")
            .attr("x", arrayNodes[0].x + tx + 55)
            .attr("y", requesterProcess.y)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", arrayNodes[0].x + tx + 60)
            .attr("y", requesterProcess.y + 16)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[0].x + tx + 25)
            .attr("y1", arrayNodes[0].y + 30)
            .attr("x2", requesterProcess.x)
            .attr("y2", requesterProcess.y + 30)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
        // proximo processo //
        multicast.append("rect")
            .attr("x", arrayNodes[2].x + 125)
            .attr("y", arrayNodes[2].y - 75)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", arrayNodes[2].x + 130)
            .attr("y", arrayNodes[2].y - 59)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[2].x + tx + 25)
            .attr("y1", arrayNodes[2].y)
            .attr("x2", requesterProcess.x)
            .attr("y2", requesterProcess.y + 2 * ty)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");

        multicast.append("rect")
            .attr("x", requesterProcess.x + (tx / 2) + 5)
            .attr("y", arrayNodes[3].y - 73)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", requesterProcess.x + (tx / 2) + 10)
            .attr("y", arrayNodes[3].y - 57)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[3].x + (tx / 2))
            .attr("y1", arrayNodes[3].y)
            .attr("x2", requesterProcess.x + (tx / 2))
            .attr("y2", requesterProcess.y + 2 * ty)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
    if (requesterProcess.id == 2) {
        multicast.append("rect")
            .attr("x", requesterProcess.x + (tx / 2) + 5)
            .attr("y", requesterProcess.y - 73)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", requesterProcess.x + (tx / 2) + 10)
            .attr("y", requesterProcess.y - 57)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[0].x + (tx / 2))
            .attr("y1", arrayNodes[0].y + 2 * ty)
            .attr("x2", requesterProcess.x + (tx / 2))
            .attr("y2", requesterProcess.y)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
        //proximo processo //
        multicast.append("rect")
            .attr("x", arrayNodes[2].x + 125)
            .attr("y", arrayNodes[2].y - 75)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", arrayNodes[2].x + 130)
            .attr("y", arrayNodes[2].y - 59)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[1].x)
            .attr("y1", arrayNodes[1].y + 2 * ty)
            .attr("x2", requesterProcess.x + tx + 25)
            .attr("y2", requesterProcess.y)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");

        multicast.append("rect")
            .attr("x", requesterProcess.x + tx + 55)
            .attr("y", requesterProcess.y)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", requesterProcess.x + tx + 60)
            .attr("y", requesterProcess.y + 16)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[3].x)
            .attr("y1", arrayNodes[3].y + ty)
            .attr("x2", requesterProcess.x + tx + 25)
            .attr("y2", requesterProcess.y + ty)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
    if (requesterProcess.id == 3) {
        multicast.append("rect")
            .attr("x", requesterProcess.x + (tx / 2) + 5)
            .attr("y", requesterProcess.y - 73)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", requesterProcess.x + (tx / 2) + 10)
            .attr("y", requesterProcess.y - 57)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[0].x + tx + 25)
            .attr("y1", arrayNodes[0].y + 2 * ty)
            .attr("x2", requesterProcess.x)
            .attr("y2", requesterProcess.y)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
        //proximo processo //
        multicast.append("rect")
            .attr("x", arrayNodes[0].x + 170)
            .attr("y", arrayNodes[0].y + 75)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", arrayNodes[0].x + 175)
            .attr("y", arrayNodes[0].y + 91)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[1].x + (tx / 2))
            .attr("y1", arrayNodes[1].y + 2 * ty)
            .attr("x2", requesterProcess.x + (tx / 2))
            .attr("y2", requesterProcess.y)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");

        multicast.append("rect")
            .attr("x", arrayNodes[2].x + tx + 60)
            .attr("y", arrayNodes[2].y)
            .attr("class", "bloco")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 54)
            .attr("height", 22)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", "#6EB960");
        multicast.append("text")
            .attr("x", arrayNodes[2].x + tx + 65)
            .attr("y", arrayNodes[2].y + 16)
            .attr("class", "bloco")
            .text("P" + requesterProcess.id + "-" + requesterProcess.clock)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");
        multicast.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("class", "bloco")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");
        multicast.append("line")
            .attr("x1", arrayNodes[2].x + tx + 25)
            .attr("y1", arrayNodes[2].y + ty)
            .attr("x2", requesterProcess.x)
            .attr("y2", requesterProcess.y + ty)
            .attr("class", "bloco")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("marker-start", "url(#arrow)");
    }
}
// função que retorna mensagem para quem solicitou 
function heldBroadcast(process) {
    d3.select("#multicastsvg").selectAll(".bloco").remove();
    for (let index = 0; index < process.processQueue.length; index++) {
        drawMessage(process, arrayNodes[process.processQueue[index]]);
    }
}
//FUNÇÃO PARA ATUALIZAR OS PROCESSOS COM AS MENSAGENS DE LIBERAÇÃO DO PROCESSO HELD 
function unlockAccess(process) {
    let index = 0
    while (process.processQueue[index] != null) {
        //chama verificação daquele processo para verificar se ele pode acessar a sessão crítica
        if (reviewAccess(arrayNodes[process.processQueue[index]]) === 3) {

            arrayNodes[process.processQueue[index]].message = messageData[2];
            updateStatus(process.processQueue[index]);
            //atualizar desenho do status
        }
        process.processQueue.splice(0, 1);
        drawQueue(process);
    }
}
function reviewAccess(requesterProcess) {
    var access = 0;
    for (let i = 0; i < arrayNodes.length; i++) {
        if (requesterProcess.id == arrayNodes[i].id) {
            i++;
            if (i == 4) {
                return access;
            }
        }
        if (arrayNodes[i].message === messageData[0]) {
            access++;
        } else {
            if (arrayNodes[i].message === messageData[1]) {
                if (arrayNodes[i].clock > requesterProcess.clock) {
                    access++;
                }
            }
        }
    }
    return access;
}
function unShowLastProcess(e) {
    d3.select("#multicastsvg").selectAll(".posicao" + e)
        .transition()
        .duration(400)
        .delay(function (d, i) { return i * 50; })
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", "#000")
                .style("stroke-width", 1)
        })
}
// função para mostrar que processo está processando //
function showCurrentProcess(e) {
    d3.select("#multicastsvg").selectAll(".posicao" + e)
        .transition()
        .duration(400)
        .delay(function (d, i) { return i * 50; })
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", "#000")
                .style("stroke-width", 1)
                .transition()
                .style("stroke", "#00B125")
                .style("stroke-width", 10)
                .on("start", repeat);
        })
}

function drawTable() {
    for (let i = 0; i < arrayNodes.length; i++) {
        d3.select("#table2").append("tr").attr("class", "linha" + i)
            .attr("align", "center")
            .append("td").text(arrayNodes[i].id);
        d3.select("#table2").select(".linha" + i).append("td") // colocar o relogio //
            .append("input")
            .attr("type", "number")
            .attr("step", "1")
            .attr("min", "1")
            .attr("max", "100")
            .attr("class", "form")
            .attr("id", "relogio" + i)
            .attr("value", arrayNodes[i].clock)
            .attr("oninput", "checkClocks(" + i + ")");
        d3.select("#table2").select(".linha" + i).append("td") // select da mensagem //
            .append("select")
            .attr("class", "combobox" + i)
        d3.select("#table2").select(".linha" + i).selectAll(".combobox" + i).selectAll("option")
            .data(messageData).enter()
            .append("option")
            .text(function (d) { return d; });
    }
}

function checkClocks(id) {
    var clock = document.getElementById("relogio" + id).value;
    if (clock == 0) {
        alert("Atenção! Relógios não podem ficar vazios ou serem zero!");
        document.getElementById("relogio" + id).value = arrayNodes[id].clock;
    }
    if (isEqualClock(clock)) {
        alert("Atenção! Relógios devem ser únicos!");
        document.getElementById("relogio" + id).value = arrayNodes[id].clock;
    }
}

function isEqualClock(clock) {
    for (let i = 0; i < arrayNodes.length; i++) {
        if (clock == arrayNodes[i].clock) {
            return true;
        }
    }
    return false;
}
// função para inserir valores que vieram da tabela //
function playCustom() {
    ini = 0;
    if (checkMessage()) {
        alert("Atenção! Só pode ter um processo com HELD!");
    }
    else {
        for (let i = 0; i < arrayNodes.length; i++) {
            arrayNodes[i].message = d3.select("#table2").select(".linha" + i).selectAll(".combobox" + i).property("value");
            updateStatus(i);
            arrayNodes[i].clock =  parseInt(document.getElementById("relogio" + i).value,10);
            updateClock(i);
        }
    }
}

function checkMessage() {
    var messageHeld;
    for (let i = 0; i < arrayNodes.length; i++) {
        messageHeld = d3.select("#table2").select(".linha" + i).selectAll(".combobox" + i).property("value");
        if (messageHeld == messageData[2]) {
            for (let index = 0; index < arrayNodes.length; index++) {
                if (index != i) {
                    var messageTable = d3.select("#table2").select(".linha" + index).selectAll(".combobox" + index).property("value");
                    if (messageHeld == messageTable) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
// mudança do desenho do relogio //
function updateClock(p) {
    d3.select("#multicastsvg").selectAll(".P" + p)
        .transition()
        .delay(1000)
        .text("[" + arrayNodes[p].clock + "]");
}

window.onload = function () {
    drawInit();
    document.getElementById("buttonsR2").style.display = "block";
    drawTable();
    drawExample();
}

const d = document.querySelector("#transition");
window.onscroll = function () { scrollFunction() };
function scrollFunction() {

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
    // troca de desenho //
    if (isVisible(d) == true) {
        document.getElementById("buttons").style.display = "flex";
    }
    else {
        document.getElementById("buttons").style.display = "none";
    }
}
// detectar o ultimo desenho //
function isVisible(el) {
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

var example = d3.select("#firstsvg")
    .append("svg")
    .attr("width", 420)
    .attr("height", 80)
// desenho da legenda //
function drawExample() {
    y0 = 10;
    x0 = 30;
    idProcess = 0;
    for (let i = 0; i < 2; i++) {
        x0 = x0 + i * 250;
        example.append("rect")
            .attr("class", "legenda" + idProcess)
            .attr("style", "fill:#fff")
            .attr("stroke", "#000")
            .attr("x", x0)
            .attr("y", y0)
            .attr("width", tx + 24)
            .attr("height", ty + ty + 0.2);

        example.append("rect")
            .attr("style", "fill:pink")
            .attr("class", "blocoNome")
            .attr("x", x0)
            .attr("y", y0)
            .attr("width", tx)
            .attr("height", ty)
            .attr("stroke", "#000");
        example.append("text")
            .attr("x", x0 + 30)
            .attr("y", y0 + 22)
            .text("P" + idProcess)
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000");
        example.append("text")
            .attr("x", x0 + 50)
            .attr("y", y0 + 22)
            .text("[11]")
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000");

        example.append("rect")
            .attr("class", "blocoMensagem")
            .attr("style", "fill:#2892D7")
            .attr("x", x0)
            .attr("y", y0 + 30.2)
            .attr("width", tx)
            .attr("height", ty)
            .attr("stroke", "#000");
        example.append("text")
            .attr("x", x0 + 2)
            .attr("y", y0 + 52)
            .text(messageData[1])
            .attr("font-family", "sans-serif")
            .attr("font-size", "17px")
            .attr("fill", "#000000");

        example.append("rect")
            .attr("class", "filaMensagem")
            .attr("style", "fill:#7B7B7B")
            .attr("stroke", "#000")
            .attr("x", x0 + 96)
            .attr("y", y0)
            .attr("width", 25)
            .attr("height", ty + ty + 0.2);
        idProcess++;
    }
    // mensagem //
    example.append("rect")
        .attr("x", x0 - 85)
        .attr("y", y0 + 2)
        .attr("class", "teste")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("width", 54)
        .attr("height", 22)
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", "#6EB960");
    example.append("text")
        .attr("x", x0 - 82)
        .attr("y", y0 + 18)
        .text("P0" + "   -11")
        .attr("font-family", "sans-serif")
        .attr("font-size", "17px")
        .attr("fill", "#000000");
    example.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 10)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");
    example.append("line")
        .attr("x1", x0)
        .attr("y1", y0 + 30)
        .attr("x2", x0 - 128)
        .attr("y2", y0 + 30)
        .attr("stroke", "#000")
        .attr("stroke-width", 3)
        .attr("marker-start", "url(#arrow)");
}

function showId() {
    d3.select("#firstsvg").selectAll(".blocoNome")
        .transition()
        .duration(400)
        .delay(function (d, i) { return i * 50; })
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", red)
                .style("stroke-width", 1)
                .transition()
                .style("stroke", red)
                .style("stroke-width", 4)
                .on("start", repeat);
        })
}
function unshowId() {
    d3.select("#firstsvg").selectAll(".blocoNome")
        .transition()
        .duration(700)
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", lineC)
                .style("stroke-width", 1)
                .on("start", repeat);
        })
}

function showMessage() {
    d3.select("#firstsvg").selectAll(".teste")
        .transition()
        .duration(400)
        .delay(function (d, i) { return i * 50; })
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", red)
                .style("stroke-width", 1)
                .transition()
                .style("stroke", red)
                .style("stroke-width", 4)
                .on("start", repeat);
        })
}
function unshowMessage() {
    d3.select("#firstsvg").selectAll(".teste")
        .transition()
        .duration(700)
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", lineC)
                .style("stroke-width", 1)
                .on("start", repeat);
        })
}

function showQueue() {
    d3.select("#firstsvg").selectAll(".filaMensagem")
        .transition()
        .duration(400)
        .delay(function (d, i) { return i * 50; })
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", red)
                .style("stroke-width", 1)
                .transition()
                .style("stroke", red)
                .style("stroke-width", 4)
                .on("start", repeat);
        })
}
function unshowQueue() {
    d3.select("#firstsvg").selectAll(".filaMensagem")
        .transition()
        .duration(700)
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", lineC)
                .style("stroke-width", 1)
                .on("start", repeat);
        })
}

function showState() {
    d3.select("#firstsvg").selectAll(".blocoMensagem")
        .transition()
        .duration(400)
        .delay(function (d, i) { return i * 50; })
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", red)
                .style("stroke-width", 1)
                .transition()
                .style("stroke", red)
                .style("stroke-width", 4)
                .on("start", repeat);
        })
}
function unshowState() {
    d3.select("#firstsvg").selectAll(".blocoMensagem")
        .transition()
        .duration(700)
        .on("start", function repeat() {
            d3.active(this)
                .transition()
                .style("stroke", lineC)
                .style("stroke-width", 1)
                .on("start", repeat);
        })
}