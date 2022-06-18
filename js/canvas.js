var first = d3.select("#canvasR")
		                .append("svg")
		                .attr("width", 120)
		                .attr("height", 120);

var i, radio = 10, angle, n1 = 5, x1, y1;
var nodesFirst = [];
var folga = 0.258;
var color = "#2892D7", line = "RoyalBlue";
var partColor = "#FF9F1C", lineC = "#000000";

var arc = d3.arc()
            .innerRadius(45.5)
            .outerRadius(46.5)
            .startAngle(0)
            .endAngle(360);

first.append("path")
	        .attr("d", arc)
	        .attr("transform", "translate(60, 60)");

for(i=0;i<n1;i++){
	angle = 2*Math.PI*i/n1;
	x1=Math.cos(angle)*45 + 60;
	y1=Math.sin(angle)*45 + 60;
	angle=angle+(Math.PI/2);

	var newNode = {x: x1, y: y1, id: i, angle};
	nodesFirst.push(newNode);

	first.append("circle")
	        .attr("cx", x1)
	        .attr("cy", y1)
	        .attr("r", radio)
	        .attr("stroke", line)
	        .attr("stroke-width", 1)
	        .attr("fill", color)
	        .append("text")
	        .text("P"+i);

	first.append("text")
	        .attr("x", nodesFirst[i].x-6)
			.attr("y", nodesFirst[i].y+4)
	        .text("P"+i)
	        .attr("font-family", "sans-serif")
	        .attr("font-size", "10px")
	        .attr("fill", lineC);
}

function showLink(i){
	if(i===nodesFirst.length-1){
		var arc = d3.arc()
                    .innerRadius(50.5)
                    .outerRadius(51.5)
			        .startAngle(nodesFirst[0].angle-folga+(2*Math.PI))
			        .endAngle(nodesFirst[i].angle+folga);
		}
	else{
		var arc = d3.arc()
                    .innerRadius(50.5)
                    .outerRadius(51.5)
			        .startAngle(nodesFirst[i+1].angle-folga)
			        .endAngle(nodesFirst[i].angle+folga);
	}

	var seta = first.append("defs").append("marker")
							.attr("id", "arrow")
							.attr("viewBox", "0 -5 10 10")
							.attr("refX", 8)
							.attr("refY", 0)
							.attr("markerWidth", 7)
							.attr("markerHeight", 7)
							.attr("orient", "auto-start-reverse")
							.append("path")
							.attr("d", "M0,-5L10,0L0,5");
			    
	first.append("path")
			.attr("id", "seta")
			.attr("d", arc)
			.attr("transform", "translate(60, 60)")
			.attr("marker-start", "url(#arrow)");
}

i=0;
		
function myLoop () {
	setTimeout(function () { 
        first.select("#seta").remove(); 
        first.select("defs").remove();
    }, 1000);

	setTimeout(function () {
		showLink(i);
		i++;
		if(i==n1)
			i=0;
		myLoop();
	}, 1000)
}

window.onload = myLoop();

var second = d3.select("#canvasB")
		                .append("svg")
		                .attr("width", 120)
		                .attr("height", 120);
		                
		var l, j, k, n = 5, x, y;
		var nodessecond = [];
		var strength = [];
		strength.push(7);
		strength.push(3);
		strength.push(1);
		strength.push(9);
        strength.push(6);
        
for(l=0;l<n;l++){
    var bigger = [];
    angle = 2*Math.PI*l/n;
    x=Math.cos(angle)*45 + 60;
    y=Math.sin(angle)*45 + 60;
    angle=angle+(Math.PI/2);

    for(j=0;j<n;j++){
        if(strength[j]>strength[l])
            bigger.push(j);
    }

    var newNode = {x: x, y: y, id: l, angle, bigger};
    nodessecond.push(newNode);

    second.append("circle")
            .attr("id", "circle"+l)
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", radio)
            .attr("stroke", line)
            .attr("stroke-width", 1)
            .attr("fill", color)
            .append("text")
            .text("P"+l);

    second.append("text")
            .attr("x", nodessecond[l].x-6)
            .attr("y", nodessecond[l].y+4)
            .text("P"+l)
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", lineC);
}

function showLinkB(id){
    second.append("defs").append("marker")
                .attr("id", "arrowB")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 24)
                .attr("refY", 0)
                .attr("markerWidth", 7)
                .attr("markerHeight", 7)
                .attr("orient", "auto-start-reverse")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5");
    if(nodessecond[id].bigger.length != 0){
        for(l=0;l<nodessecond[id].bigger.length;l++){
            var next = nodessecond[id].bigger[l];
            second.append("line")
                    .attr("id", "seta")
                    .attr("x1",nodessecond[next].x)
                    .attr("y1",nodessecond[next].y)
                    .attr("x2",nodessecond[id].x)
                    .attr("y2",nodessecond[id].y)
                    .attr("stroke",lineC)
                    .attr("stroke-width",1)
                    .attr("marker-start", "url(#arrowB)");

            second.selectAll("circle").remove();
            second.selectAll("text").remove();

            for(k=0;k<nodessecond.length;k++){
                second.append("circle")
                        .attr("id", "circle"+k)
                        .attr("cx", nodessecond[k].x)
                        .attr("cy", nodessecond[k].y)
                        .attr("r", radio)
                        .attr("stroke", line)
                        .attr("stroke-width", 1)
                        .attr("fill", color)
                        .append("text")
                        .text("P"+k);

                second.append("text")
                        .attr("x", nodessecond[k].x-6)
                        .attr("y", nodessecond[k].y+4)
                        .text("P"+k)
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "10px")
                        .attr("fill", lineC);
            }
            second.select("#circle"+id).style("fill", partColor);
        }
    }
}

j=0;

function myLoopB () {
    setTimeout(function () {
        second.select("defs").remove();
        second.selectAll("#seta").remove();
        second.selectAll("circle").style("fill", color);
    }, 1000)
    setTimeout(function () {
        second.select("#circle"+j).style("fill", partColor);
        showLinkB(j);
        j++;
        if(j==n)
            j=0;
        myLoopB();
    }, 1000)
}

window.onload = myLoopB();

