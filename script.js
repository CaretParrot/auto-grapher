let textLines = [];
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
    lines = document.getElementById("input").value.split("\n");
    equations = [];
    domain = document.getElementById("domain").value;
    range = document.getElementById("range").value;
    drawGraph();
}

function drawGraph() {
    paint.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    points = [];
    drawGrid();

    paint.beginPath();
    paint.strokeStyle = "white";
    paint.lineWidth = 3;

    for (let i = 0; i < lines.length; i++) {
        equations.push(new mathPlus.MathFunction(lines[i], "x"));
    }

    for (let i = 0; i < equations.length; i++) {
        try {
            paint.moveTo(-canvas.width / 2, -equations[i].evaluate(-canvas.width / 2) * canvas.width / domain / 2);

            for (let xVal = -domain; xVal <= domain; xVal += 0.01) {
                xVal = Math.round(xVal * 100) / 100;
                let adjustedXVal = Math.round(xVal * canvas.width / domain / 2 * 100) / 100;
                if (isFinite(-equations[i].evaluate(adjustedXVal))) {
                    paint.lineTo(adjustedXVal, -equations[i].evaluate(xVal) * canvas.width / domain / 2);
                    points.push([adjustedXVal, -equations[i].evaluate(adjustedXVal)]);
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

function copyValue() {
    navigator.clipboard.writeText(document.getElementById("outputLabel").innerHTML.slice(2));
}

function copyFunctions() {
    navigator.clipboard.writeText(document.getElementById("input").value);
}

onkeydown = function (event) {
    if (event.key === "Enter") {
        console.log(points);
    }
}