
const coordsToCanvas = (coords, canvasWidth, canvasHeight) => {
    const { x, y } = coords;
    return {
        x: (canvasWidth / 2) + x,
        y: (canvasHeight / 2) - y
    }
}
