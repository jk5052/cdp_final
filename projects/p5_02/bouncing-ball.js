let x, y;                 
let dx, dy;               
let baseRadius = 30;      
let radius;              
let radiusSpeed = 0.05;    
let t = 0;                

function setup() {
  createCanvas(800, 400);

  x = width / 2;
  y = height / 2;
  dx = 4;
  dy = 3;
}

function draw() {
  background(240);

 
  radius = baseRadius + sin(t) * 10;  // base ± 10
  t += radiusSpeed;


  fill(100, 180, 255);
  noStroke();
  ellipse(x, y, radius * 2);


  x += dx;
  y += dy;

  
  if (x - radius < 0 || x + radius > width) {
    dx *= -1;
  }
  if (y - radius < 0 || y + radius > height) {
    dy *= -1;
  }
}
