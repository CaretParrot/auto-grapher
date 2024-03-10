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

let screen = {
    size: +idTree.screenSize.value,
    edge: this.size / 2,
    windowX: +idTree.windowX.value,
    windowY: +idTree.windowY.value
}

function regenerateGrid() {
    for (let i = 0; i <= edge; i += (edge) / screen.windowX) {
        idTree.canvas.innerHTML += `<path d="M${i},${-edge} L${i},${edge}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${edge}, ${edge})" />`;
    }

    for (let i = 0; i >= -edge; i -= (edge) / screen.windowX) {
        idTree.canvas.innerHTML += `<path d="M${i},${-edge} L${i},${edge}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${edge}, ${edge})" />`;
    }

    for (let i = 0; i <= edge; i += (edge) / screen.windowY) {
        idTree.canvas.innerHTML += `<path d="M${-edge},${i} L${edge},${i}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${edge}, ${edge})" />`;
    }

    for (let i = 0; i >= -edge; i -= (edge) / screen.windowY) {
        idTree.canvas.innerHTML += `<path d="M${-edge},${i} L${edge},${i}" style="stroke: #808080; fill: none; stroke-width: 1;" transform="translate(${edge}, ${edge})" />`;
    }

    idTree.canvas.innerHTML = idTree.canvas.innerHTML + `<path d="M${-edge},0 L${edge},0" style="stroke: White; fill: none; stroke-width: 1;" transform="translate(${edge}, ${edge})" />`;
    idTree.canvas.innerHTML = idTree.canvas.innerHTML + `<path d="M0,${edge} L0,${-edge}" style="stroke: White; fill: none; stroke-width: 1;" transform="translate(${edge}, ${edge})" />`;
}

function evaluateYValue(value) {
    if (!isNaN(value)) {
        return -Function("return " + equations[j].replace(/x/g, `(${value})`))();
    }
}

regenerateGrid();

oninput = function () {
    d = ``;

    screen = {
        size: +idTree.screenSize.value,
        edge: this.size / 2,
        windowX: +idTree.windowX.value,
        windowY: +idTree.windowY.value
    }

    if (screen.size === "") {
        return;
    }

    idTree.canvas.style.width = screen.size + "px";
    idTree.canvas.style.height = screen.size + "px";

    equations = idTree.input.value.split("\n");

    idTree.canvas.innerHTML = "";

    if (screen.windowX === "") {
        return;
    }

    if (screen.windowY === "") {
        return;
    }

    regenerateGrid();

    for (j = 0; j < equations.length; j++) {
        equations[j] = equations[j].replace(/ /g, "");

        if (equations[j] === "") {
            break;
        }

        if (equations[j].includes("let")) {
            break;
        }

        xvalue = -screen.windowX;
        yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;

        if (abs(yvalue) === Infinity || isNaN(yvalue)) {
            while (abs(yvalue) === Infinity || isNaN(yvalue)) {
                xvalue += 0.01;
                yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;
                if (xvalue > screen.WindowX) {
                    break;
                }
            }
        }

        d += `M${(screen.size / (screen.windowX * 2)) * xvalue},${(screen.size / (screen.windowY * 2)) * yvalue} \n`;

        for (xvalue = -screen.windowX; xvalue <= screen.windowX; xvalue += 0.01) {
            xvalue = Math.round(xvalue * 100) / 100;
            yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;

            if (equations[j].includes("x")) {
                if (yvalue === -Infinity || yvalue === Infinity || isNaN(yvalue)) {
                    while (abs(yvalue) === Infinity || isNaN(yvalue)) {
                        xvalue += 0.01;
                        yvalue = Math.round(evaluateYValue(xvalue) * 100000) / 100000;
                        if (xvalue > screen.WindowX) {
                            break;
                        }
                    }

                    d += `M${(screen.size / (screen.windowX * 2)) * xvalue},${(screen.size / (screen.windowY * 2)) * yvalue} \n`;
                } else {
                    d += `L${(screen.size / (screen.windowX * 2)) * xvalue},${(screen.size / (screen.windowY * 2)) * yvalue} \n`;
                    points.toString(j)[xvalue] = -yvalue;
                }
            }
        }

        idTree.canvas.innerHTML += `<path id="function" d="${d}" style="stroke: White; fill: none; stroke-width: 3;" transform="translate(${edge}, ${edge})"/>`;
    }
}