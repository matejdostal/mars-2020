
const coordsToCanvas = (coords, canvasWidth, canvasHeight) => {
    const { x, y } = coords;
    return {
        x: (canvasWidth / 2) + x,
        y: (canvasHeight / 2) - y
    }
}

const distanceBetweenTwoPoints = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.round(x2 - x1) + Math.round(y2 - y1)).toFixed(2);
}
