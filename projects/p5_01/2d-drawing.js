var sketch1 = function(p) {
  var canvasWidth = 800;
  var canvasHeight = 400;
  var gridSpacing = 40;
  var canvas;

  p.setup = function() {
    canvas = p.createCanvas(canvasWidth, canvasHeight);
    if (p.select('#canvas-container-1')) {
      canvas.parent('canvas-container-1');
    }
  };

  p.draw = function() {
    p.background(250);
    drawGrid();
    drawPrimitives();
  };

  function drawGrid() {
    p.stroke(200);
    p.strokeWeight(1);
    for (var x = 0; x <= p.width; x += gridSpacing) {
      p.line(x, 0, x, p.height);
    }
    for (var y = 0; y <= p.height; y += gridSpacing) {
      p.line(0, y, p.width, y);
    }
  }

  function drawPrimitives() {
    // Rectangle
    p.fill(255, 100, 100);
    p.rect(120, 80, 100, 60);

    // Ellipse
    p.fill(100, 180, 255);
    p.ellipse(350, 200, 90, 90);

    // Line
    p.stroke(80, 200, 120);
    p.strokeWeight(4);
    p.line(500, 100, 700, 300);

    // Triangle
    p.noStroke();
    p.fill(255, 220, 80);
    p.triangle(600, 80, 750, 60, 700, 200);

    // Pentagon 
    p.fill(150, 100, 255);
    p.stroke(50, 50, 200);
    p.strokeWeight(2);
    p.beginShape();
    for (var i = 0; i < 5; i++) {
      var angle = p.TWO_PI * i / 5 - p.HALF_PI;
      var x = 180 + p.cos(angle) * 40;
      var y = 320 + p.sin(angle) * 40;
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);

    // Arc 
    p.noStroke();
    p.fill(0, 200, 200);
    p.arc(400, 320, 100, 100, p.PI, p.TWO_PI, p.PIE);
  }
};

// Create the instance
var myp5_1 = new p5(sketch1, 'canvas-container-1');
