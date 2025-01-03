let xvalue;
let yvalue;
let equations = [];
let points = [];
let output;
let d;
let j;
const caretReplacement = new RegExp("^", "g");

document.getElementById("screenSize").value = window.innerHeight / 2;

let graphWindow = {
    size: +document.getElementById("screenSize").value,
    edge: +document.getElementById("screenSize").value / 2,
    windowX: +document.getElementById("windowX").value,
    windowY: +document.getElementById("windowY").value
}


document.getElementById("canvas").style.width = document.getElementById("screenSize").value + "px";
document.getElementById("canvas").style.height = document.getElementById("screenSize").value + "px";

document.body.onresize = function (event) {
    document.getElementById("canvas").style.width = document.getElementById("screenSize").value + "px";
    document.getElementById("canvas").style.height = document.getElementById("screenSize").value + "px";
}

function regenerateGrid() {
    for (let i = 0; i <= graphWindow.edge; i += (graphWindow.edge) / graphWindow.windowX) {
        document.getElementById("canvas").innerHTML += `<path d="M${i},${-graphWindow.edge} L${i},${graphWindow.edge}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
    }

    for (let i = 0; i <= graphWindow.edge; i += (graphWindow.edge) / graphWindow.windowY) {
        document.getElementById("canvas").innerHTML += `<path d="M${-graphWindow.edge},${i} L${graphWindow.edge},${i}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
    }

    for (let i = 0; i >= -graphWindow.edge; i -= (graphWindow.edge) / graphWindow.windowX) {
        document.getElementById("canvas").innerHTML += `<path d="M${i},${-graphWindow.edge} L${i},${graphWindow.edge}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
    }

    for (let i = 0; i >= -graphWindow.edge; i -= (graphWindow.edge) / graphWindow.windowY) {
        document.getElementById("canvas").innerHTML += `<path d="M${-graphWindow.edge},${i} L${graphWindow.edge},${i}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
    }

    document.getElementById("canvas").innerHTML = document.getElementById("canvas").innerHTML + `<path d="M${-graphWindow.edge},0 L${graphWindow.edge},0" style="stroke: White; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
    document.getElementById("canvas").innerHTML = document.getElementById("canvas").innerHTML + `<path d="M0,${graphWindow.edge} L0,${-graphWindow.edge}" style="stroke: White; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
}

function evaluateYValue(value, equationIndex) {
    try {
        if (!isNaN(value)) {
            return -Function("return " + equations[equationIndex].replace(/x/g, `(${value})`))();
        } else {
            throw "Not a number."
        }
    }
    catch (err) {
        console.log(err);
    }
}

regenerateGrid();

oninput = function () {
    d = ``;

    if (document.getElementById("screenSize").value == "" || document.getElementById("windowX").value == "" || document.getElementById("windowY").value == "") {
        return;
    }

    graphWindow = {
        size: +document.getElementById("screenSize").value,
        edge: +document.getElementById("screenSize").value / 2,
        windowX: +document.getElementById("windowX").value,
        windowY: +document.getElementById("windowY").value
    }

    document.getElementById("canvas").style.width = graphWindow.size + "px";
    document.getElementById("canvas").style.height = graphWindow.size + "px";
    equations = document.getElementById("input").value.split("\n");
    document.getElementById("equation").max = equations.length - 1;

    document.getElementById("canvas").innerHTML = "";

    regenerateGrid();

    for (j = 0; j < equations.length; j++) {
        equations[j] = equations[j].replace(/ /g, "");

        if (equations[j] === "") {
            break;
        }

        if (equations[j].includes("let")) {
            break;
        }

        xvalue = -graphWindow.windowX;
        yvalue = Math.round(evaluateYValue(xvalue, j) * 100000) / 100000;

        if (!isFinite(yvalue)) {
            while (!isFinite(yvalue) && xvalue <= graphWindow.windowX) {
                xvalue += 0.01;
                yvalue = Math.round(evaluateYValue(xvalue, j) * 100000) / 100000;
            }
        }

        d += `M${(graphWindow.size / (graphWindow.windowX * 2)) * xvalue},${(graphWindow.size / (graphWindow.windowY * 2)) * yvalue} \n`;
        points[j] = {};

        for (xvalue = -graphWindow.windowX; xvalue <= graphWindow.windowX; xvalue += 0.01) {
            xvalue = Math.round(xvalue * 100) / 100;
            yvalue = Math.round(evaluateYValue(xvalue, j) * 100000) / 100000;
            if (equations[j].includes("x")) {
                if (!isFinite(yvalue)) {
                    while (!isFinite(yvalue) && xvalue <= graphWindow.windowX) {
                        xvalue += 0.01;
                        yvalue = Math.round(evaluateYValue(xvalue, j) * 100000) / 100000;
                    }
                    d += `M${(graphWindow.size / (graphWindow.windowX * 2)) * xvalue},${(graphWindow.size / (graphWindow.windowY * 2)) * yvalue} \n`;
                } else {
                    d += `L${(graphWindow.size / (graphWindow.windowX * 2)) * xvalue},${(graphWindow.size / (graphWindow.windowY * 2)) * yvalue} \n`;
                    points[j][xvalue] = yvalue;
                }
            }
        }

        returnOutput();

        document.getElementById("canvas").innerHTML += `<path id="function" d="${d}" style="stroke: White; fill: none; stroke-width: 3;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})"/>`;
    }
}

function returnOutput() {
    let output = -evaluateYValue(+document.getElementById("xinput").value, +document.getElementById("equation").value);
    document.getElementById("outputLabel").innerHTML = `Y: ${Math.round(output * 100000) / 100000}`;
}

function copyValue() {
    navigator.clipboard.writeText(document.getElementById("outputLabel").innerHTML.slice(2));
}

function copyFunctions() {
    navigator.clipboard.writeText(document.getElementById("input").value);
}