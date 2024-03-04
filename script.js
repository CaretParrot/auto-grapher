setupTree();

let xvalue;
let yvalue;
let equations = [];

idTree.canvas.style.width = `calc(${window.innerHeight / 2}px)`;
idTree.canvas.style.height = `calc(${window.innerHeight / 2}px)`;
idTree.screenSize.value = window.innerHeight / 2;

let screen = {
    size: idTree.screenSize.value,
    windowX: idTree.windowX.value,
    windowY: idTree.windowY.value
}

let points = {}
let output;
let d;
let j;

function regenerateGrid() {
    for (let i = 0; i <= screen.size / 2; i += (screen.size / 2) / screen.windowX) {
        idTree.canvas.innerHTML += `<path d="M${i},${-screen.size / 2} L${i},${screen.size / 2}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${screen.size / 2}, ${screen.size / 2})" />`;
    }

    for (let i = 0; i >= -screen.size / 2; i -= (screen.size / 2) / screen.windowX) {
        idTree.canvas.innerHTML += `<path d="M${i},${-screen.size / 2} L${i},${screen.size / 2}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${screen.size / 2}, ${screen.size / 2})" />`;
    }

    for (let i = 0; i <= screen.size / 2; i += (screen.size / 2) / screen.windowY) {
        idTree.canvas.innerHTML += `<path d="M${-screen.size / 2},${i} L${screen.size / 2},${i}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${screen.size / 2}, ${screen.size / 2})" />`;
    }

    for (let i = 0; i >= -screen.size / 2; i -= (screen.size / 2) / screen.windowY) {
        idTree.canvas.innerHTML += `<path d="M${-screen.size / 2},${i} L${screen.size / 2},${i}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${screen.size / 2}, ${screen.size / 2})" />`;
    }

    idTree.canvas.innerHTML = idTree.canvas.innerHTML + `<path d="M${-screen.size / 2},0 L${screen.size / 2},0" style="stroke: White; fill: none; stroke-width: 1;" transform="translate(${screen.size / 2}, ${screen.size / 2})" />`;
    idTree.canvas.innerHTML = idTree.canvas.innerHTML + `<path d="M0,${screen.size / 2} L0,${-screen.size / 2}" style="stroke: White; fill: none; stroke-width: 1;" transform="translate(${screen.size / 2}, ${screen.size / 2})" />`;
}

function evaluateYValue(value) {
    if (!value.isNaN()) {
        return -Function("return " + equations[j].replace(/x/g, `(${value})`))();
    }
}

regenerateGrid();

oninput = function () {
    d = ``;

    screen = {
        size: idTree.screenSize.value,
        windowX: idTree.windowX.value,
        windowY: idTree.windowY.value
    }

    if (screen.size == "") {
        return;
    }

    idTree.canvas.style.width = idTree.screenSize.value + "px";
    idTree.canvas.style.height = idTree.screenSize.value + "px";

    equations = idTree.input.value.split("\n");

    idTree.canvas.innerHTML = "";

    if (screen.windowX == "") {
        return;
    }

    if (screen.windowY == "") {
        return;
    }

    regenerateGrid();

    for (j = 0; j < equations.length; j++) {
        equations[j] = equations[j].replace(/ /g, "");

        if (equations[j] == "") {
            break;
        }

        if (equations[j].includes("let")) {
            break;
        }

        xvalue = -screen.windowX;
        yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;

        if (abs(yvalue) === Infinity || yvalue.isNaN()) {
            while (abs(yvalue) === Infinity || yvalue.isNaN()) {
                xvalue += 0.01;
                yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;
            }
        }

        d += `M${(screen.size / (screen.windowX * 2)) * xvalue},${(screen.size / (screen.windowY * 2)) * yvalue} \n`;

        for (xvalue = -screen.windowX; xvalue < screen.windowX; xvalue += 0.01) {
            xvalue = Math.round(xvalue * 100) / 100;
            yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;

            if (equations[j].includes("x")) {
                if (yvalue === -Infinity || yvalue === Infinity || yvalue.isNaN()) {
                    while (abs(yvalue) === Infinity || yvalue.isNaN()) {
                        xvalue += 0.01;
                        yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;
                    }

                    d += `M${(screen.size / (screen.windowX * 2)) * xvalue},${(screen.size / (screen.windowY * 2)) * yvalue} \n`;
                } else {
                    d += `L${(screen.size / (screen.windowX * 2)) * xvalue},${(screen.size / (screen.windowY * 2)) * yvalue} \n`;
                    points.toString(j)["xvalue"] = -yvalue;
                }
            }
        }

        idTree.canvas.innerHTML += `<path id="function" d="${d}" style="stroke: White; fill: none; stroke-width: 3;" transform="translate(${screen.size / 2}, ${screen.size / 2})"/>`;
    }
}