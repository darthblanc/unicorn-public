const less = (a, b) => a < b
const more = (a, b) => a > b

export const snapper = (x) => {
    return parseFloat(x.toFixed(4))
}

export const DrawAt = (canvas, x, y, color, brushsize, pressureamt, redraw=false) => {
    if (!redraw){
        color = document.getElementById("colorpicker").value
        if (document.getElementById("brushstep").value != brushsize) {
            brushsize = document.getElementById("brushstep").value;
            document.getElementById("brushsz").value = brushsize;
        }
        else if (document.getElementById("brushsz").value != brushsize){
            brushsize = document.getElementById("brushsz").value;
            document.getElementById("brushstep").value = brushsize;
        }
    }

    // redohistory = []; // now that this is here after every drawing just clear this in the canvas layer file
    const drawsize = brushsize * 0.5;
    canvas.fillStyle = color;
    canvas.beginPath();
    canvas.arc(x, y, drawsize, 0, 2 * Math.PI);
    canvas.fill()
}

export const reInterpolate = (canvas, currentX, currentY, priorX, priorY, color, size, pressureamt, points, redraw=false) => {
    const calculateThenDrawX = (comparator) => {
        let interv = (currentX - priorX)/cside
        let intervy = (currentY - priorY)/cside
        while (comparator(priorX, currentX)) {
            priorX += interv
            priorY += intervy
            DrawAt(canvas, priorX, priorY, color, size, pressureamt, redraw);
        }
    }
    const calculateThenDrawY = (comparator) => {
        let intervx = (currentX - priorX)/cside;
        let intervy = (currentY - priorY)/cside;
        while (comparator(priorY, currentY)) {
            priorX += intervx
            priorY += intervy
            DrawAt(canvas, priorX, priorY, color, size, pressureamt, redraw);
        }
    }

    //find a normalized vector to interpolate
    // every pixel between the last block and this new one
    let cside = Math.sqrt(Math.pow(currentX - priorX, 2)+ Math.pow(currentY - priorY, 2));
    if (Math.abs(currentX - priorX) > Math.abs(currentY - priorY) ) {
        if (currentX > priorX) {
            calculateThenDrawX(less)
        }
        else if (currentX < priorX) {
            calculateThenDrawX(more)   
        }
    }
    else {
        if (currentY > priorY) {
            calculateThenDrawY(less)
        }
        else if (currentY < priorY) {
            calculateThenDrawY(more)
        }
    }
    if (!redraw) {
        points.push(snapper(currentX-priorX))
        points.push(snapper(currentY-priorY))
    }
    return [priorX, priorY]
}
