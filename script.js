let textLines = [];
let equations = [];
let points = [];
let output;
let d;
let j;
let canvas = document.getElementById("graph");
let paint = canvas.getContext("2d");

window.onload = function () {
    paint.translate(canvas.width / 2, canvas.height / 2);
    drawGrid();
};

function drawGrid() {
    paint.beginPath();
    paint.strokeStyle = "gray";

    for (let i = -canvas.height / 2; i <= canvas.height / 2; i += canvas.height / (10 * 2)) {
        paint.moveTo(-canvas.width / 2, i);
        paint.lineTo(canvas.width / 2, i);
    }

    for (let i = -canvas.width / 2; i <= canvas.width / 2; i += canvas.width / (10 * 2)) {
        paint.moveTo(i, -canvas.height / 2);
        paint.lineTo(i, canvas.height / 2);
    }
    
    paint.stroke();
}

oninput = function (event) {
    lines = document.getElementById("input").value.split("\n");
    equations = [];
    drawGraph();
    for (let i = 0; i < lines.length; i++) {
        equations.push(new mathPlus.MathFunction(lines[i], "x"));
    }

    for (let i = 0; i < equations.length; i++) {
        try {
            paint.moveTo(-canvas.width / 2, equations[i].evaluate(-canvas.width / 2));
            for (let xVal = -canvas.width / 2; xVal <= canvas.width / 2; xVal += 0.1) {
                paint.lineTo(xVal, equations[i].evaluate(xVal));
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }
}

function drawGraph() {
    paint.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    drawGrid();
}

function copyValue() {
    navigator.clipboard.writeText(document.getElementById("outputLabel").innerHTML.slice(2));
}

function copyFunctions() {
    navigator.clipboard.writeText(document.getElementById("input").value);
}
