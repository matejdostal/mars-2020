
var points = [];

function setup() {
    resizeCanvas(windowWidth, windowHeight);
    background(255);
    fill(0);
    angleMode(DEGREES);
    frameRate(20);
}

function draw() {
    translate(width / 2, height / 2);
    background(255);
    points.map(point => {
        circle(point[0] * 200, point[1] * 200, 4);
    });
}
