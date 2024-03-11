setupTree();

let xvalue;
let yvalue;
let equations = [];
let points = {};
let output;
let d;
let j;

idTree.canvas.style.width = `calc(${window.innerHeight / 2}px)`;
idTree.canvas.style.height = `calc(${window.innerHeight / 2}px)`;
idTree.screenSize.value = window.innerHeight / 2;

let graphWindow = {
    size: +idTree.screenSize.value,
    edge: +idTree.screenSize.value / 2,
    windowX: +idTree.windowX.value,
    windowY: +idTree.windowY.value
}

function regenerateGrid() {
    for (let i = 0; i <= graphWindow.edge; i += (graphWindow.edge) / graphWindow.windowX) {
        idTree.canvas.innerHTML += `<path d="M${i},${-graphWindow.edge} L${i},${graphWindow.edge}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
        idTree.canvas.innerHTML += `<path d="M${-graphWindow.edge},${i} L${graphWindow.edge},${i}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
    }

    for (let i = 0; i >= -graphWindow.edge; i -= (graphWindow.edge) / graphWindow.windowX) {
        idTree.canvas.innerHTML += `<path d="M${i},${-graphWindow.edge} L${i},${graphWindow.edge}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
        idTree.canvas.innerHTML += `<path d="M${-graphWindow.edge},${i} L${graphWindow.edge},${i}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
    }

    idTree.canvas.innerHTML = idTree.canvas.innerHTML + `<path d="M${-graphWindow.edge},0 L${graphWindow.edge},0" style="stroke: White; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
    idTree.canvas.innerHTML = idTree.canvas.innerHTML + `<path d="M0,${graphWindow.edge} L0,${-graphWindow.edge}" style="stroke: White; fill: none; stroke-width: 1;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})" />`;
}

function evaluateYValue(value) {
    if (!isNaN(value)) {
        return -Function("return " + equations[j].replace(/x/g, `(${value})`))();
    }
}

regenerateGrid();

oninput = function () {
    d = ``;

    if (idTree.screenSize.value === "" || idTree.windowX.value === "" || graphWindow.windowY === "") {
        return;
    }

    graphWindow = {
        size: +idTree.screenSize.value,
        edge: +idTree.screenSize.value / 2,
        windowX: +idTree.windowX.value,
        windowY: +idTree.windowY.value
    }

    idTree.canvas.style.width = graphWindow.size + "px";
    idTree.canvas.style.height = graphWindow.size + "px";

    equations = idTree.input.value.split("\n");

    idTree.canvas.innerHTML = "";

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
        yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;

        if (!isFinite(yvalue)) {
            while (!isFinite(yvalue) && xvalue <= graphWindow.windowX) {
                xvalue += 0.01;
                yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;
            }
        }

        d += `M${(graphWindow.size / (graphWindow.windowX * 2)) * xvalue},${(graphWindow.size / (graphWindow.windowY * 2)) * yvalue} \n`;

        for (xvalue = -graphWindow.windowX; xvalue <= graphWindow.windowX; xvalue += 0.01) {
            xvalue = Math.round(xvalue * 100) / 100;
            yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;

            if (equations[j].includes("x")) {
                if (!isFinite(yvalue)) {
                    while (!isFinite(yvalue) && xvalue <= graphWindow.windowX) {
                        xvalue += 0.01;
                        yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;
                    }
                    d += `M${(graphWindow.size / (graphWindow.windowX * 2)) * xvalue},${(graphWindow.size / (graphWindow.windowY * 2)) * yvalue} \n`;
                } else {
                    d += `L${(graphWindow.size / (graphWindow.windowX * 2)) * xvalue},${(graphWindow.size / (graphWindow.windowY * 2)) * yvalue} \n`;
                    points.toString(j)[xvalue] = yvalue;
                }
            }
        }

        idTree.canvas.innerHTML += `<path id="function" d="${d}" style="stroke: White; fill: none; stroke-width: 3;" transform="translate(${graphWindow.edge}, ${graphWindow.edge})"/>`;
    }
}