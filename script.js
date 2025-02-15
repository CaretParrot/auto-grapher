let lines = [];
let equations = [];
let points = [];
let output;
let d;
let j;
let canvas = document.getElementById("graph");
let paint = canvas.getContext("2d");
let domain = 10;
let range = 10;

window.onload = function () {
    paint.translate(canvas.width / 2, canvas.height / 2);
    drawGrid();
};

function drawGrid() {
    paint.beginPath();
    paint.lineWidth = 1;

    paint.strokeStyle = "gray";

    for (let i = -canvas.height / 2; i <= canvas.height / 2; i += canvas.width / (range * 2)) {
        paint.moveTo(-canvas.width / 2, i);
        paint.lineTo(canvas.width / 2, i);
    }

    for (let i = -canvas.width / 2; i <= canvas.width / 2; i += canvas.height / (domain * 2)) {
        paint.moveTo(i, -canvas.height / 2);
        paint.lineTo(i, canvas.height / 2);
    }

    paint.stroke();
    paint.beginPath();

    paint.strokeStyle = "white";

    paint.moveTo(-canvas.width / 2, 0);
    paint.lineTo(canvas.width / 2, 0);
    paint.moveTo(0, -canvas.height / 2);
    paint.lineTo(0, canvas.height / 2);

    paint.stroke();
}

oninput = function (event) {
    domain = document.getElementById("domain").value || 10;
    range = document.getElementById("range").value || 10;
    drawGraph();

    document.getElementById("functionSelect").max = lines.length - 1;

    document.getElementById("xInput").min = -domain;
    document.getElementById("xInput").max = domain;
    document.getElementById("xLabel").innerHTML = `(${+document.getElementById("xInput").value}, ${equations[+document.getElementById("functionSelect").value].evaluate(+document.getElementById("xInput").value)})`;
}

function drawGraph() {
    paint.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    points = [];
    drawGrid();

    lines = document.getElementById("input").value.split("\n");
    equations = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i] !== "") {
            equations.push(new mathPlus.MathFunction(lines[i], "x"));
        }
    }

    paint.beginPath();
    paint.strokeStyle = "white";
    paint.lineWidth = 3;

    for (let i = 0; i < equations.length; i++) {
        try {
            let xVal = Math.round(-domain * 100) / 100;
            let yVal = -equations[i].evaluate(xVal);
            paint.moveTo(xVal * canvas.width / domain / 2, yVal * canvas.height / range / 2);

            for (xVal = -domain; xVal <= domain; xVal += 0.01) {
                xVal = Math.round(xVal * 100) / 100;
                yVal = -equations[i].evaluate(xVal);
                if (isFinite(-equations[i].evaluate(xVal))) {
                    paint.lineTo(xVal * canvas.width / domain / 2, yVal * canvas.height / range / 2);
                    points.push([xVal * canvas.width / domain / 2, yVal]);
                } else {
                    paint.stroke();
                }
            }

            paint.stroke();
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }
}

function copyFunctions() {
    navigator.clipboard.writeText(document.getElementById("input").value);
}