let lines = [];
/**
 * @type {any}
 */
let equations = [];
let points = [];
let output;
let d;
let j;

/**
 * @type {number}
 */
const ROUNDING = 2;

let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("graph"));
let paint = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
let domain = /** @type {HTMLInputElement} */ (document.getElementById("domain"));
let range = /** @type {HTMLInputElement} */ (document.getElementById("range"));

let functionSelect = /** @type {HTMLInputElement} */ (document.getElementById("functionSelect"));
let xInput = /** @type {HTMLInputElement} */ (document.getElementById("xInput"));
let xLabel = /** @type {HTMLLabelElement} */ (document.getElementById("xLabel"));
let input = /** @type {HTMLInputElement} */ (document.getElementById("input"));

paint.translate(canvas.width / 2, canvas.height / 2);
drawGrid();

function drawGrid() {
    paint.beginPath();
    paint.lineWidth = 1;

    paint.strokeStyle = "gray";

    for (let i = -canvas.height / 2; i <= canvas.height / 2; i += canvas.width / (+range.value * 2)) {
        paint.moveTo(-canvas.width / 2, i);
        paint.lineTo(canvas.width / 2, i);
    }

    for (let i = -canvas.width / 2; i <= canvas.width / 2; i += canvas.height / (+domain.value * 2)) {
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

input.oninput = function () {
    drawGraph();
    refresh();
}

domain.oninput = function () {
    drawGraph();
    refresh();
}

range.oninput = function () {
    drawGraph();
    refresh();
}

xInput.oninput = function () {
    refresh();
}

functionSelect.oninput = function () {
    refresh();
}

function refresh() {
    functionSelect.max = (lines.length - 1).toString();
    xInput.min = (-domain.value).toString();
    xInput.max = domain.value;
    xLabel.innerHTML = `(${+xInput.value}, ${equations[+functionSelect.value].evaluate(+xInput.value)})`;
}

function drawGraph() {
    paint.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    points = [];
    drawGrid();

    lines = input.value.split("\n");
    equations = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i] !== "") {
            // @ts-ignore
            equations.push(new MathFunction(lines[i], "x"));
        }
    }

    paint.beginPath();
    paint.strokeStyle = "white";
    paint.lineWidth = 3;

    for (let i = 0; i < equations.length; i++) {
        try {
            let xVal = roundToPlaces(-domain.value, ROUNDING);
            let yVal = -equations[i].evaluate(xVal);
            paint.moveTo(xVal * canvas.width / +domain.value / 2, yVal * canvas.height / +range.value / 2);

            for (xVal = -domain.value; xVal <= +domain.value; xVal += 0.01) {
                xVal = roundToPlaces(xVal, ROUNDING);
                yVal = -equations[i].evaluate(xVal);
                if (isFinite(-equations[i].evaluate(xVal))) {
                    paint.lineTo(xVal * canvas.width / +domain.value / 2, yVal * canvas.height / +range.value / 2);
                    points.push([xVal * canvas.width / +domain.value / 2, yVal]);
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

/**
 * 
 * @param {number} number 
 * @param {number} numberOfPlaces 
 * @returns 
 */
function roundToPlaces(number, numberOfPlaces) {
    return Math.round(number * (10 ** numberOfPlaces)) / (10 ** numberOfPlaces);
}

function copyFunctions() {
    navigator.clipboard.writeText(input.value);
}