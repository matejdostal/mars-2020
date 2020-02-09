
//100px = 1m;
//1px = 1cm;

var rover;
var points;
const allowedDistance = 5; //5 cms

function setup() {
    resizeCanvas(windowWidth - 1, windowHeight);
    background(255);
    fill(0);
    angleMode(DEGREES);
    frameRate(20);
    translate(width / 2, height / 2);

    rover = new Rover(0, 0, 0);
    points = [new Point(180, 0), new Point(180, -10), new Point(180, -20), new Point(170, -20), new Point(160, -20), new Point(150, -20)]; //  new Point(x, y)
}

function draw() {
    translate(width / 2, height / 2);
    rover.draw();
    points.map((point, i) => {
        point.draw();
    });
}

class Rover {
    constructor(x, y, a) { //x position, y position, a rotation
        this.x = x;
        this.y = y;
        this.a = a;
        this.width = 21;
        this.height = 23;
    }
    draw() {
        const x = this.x - this.width / 2;
        const y = this.y - this.height / 2;
        rotate(this.a);
        rect(0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
        quad(x, y, x + 5, y - 8.66, x + 16, y - 8.66, x + this.width, y);
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2;
    }
    draw() {
        const x = this.x - this.size / 2;
        const y = this.y - this.size / 2;
        circle(x, y, this.size);
    }
    connect() {

    }
}