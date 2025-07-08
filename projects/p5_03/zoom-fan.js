// spatial-canvas-sketch.js
// Interactive p5.js sketch: grid, primitives, zoom, and pan with animation

var sketch3 = function(p) {
  var canvasWidth = 800;
  var canvasHeight = 400;
  var gridSpacing = 40;
  var zoom = 1;
  var offsetX = 0;
  var offsetY = 0;
  var isDragging = false;
  var lastMouseX, lastMouseY;
  var canvas;

  var t = 0;

  p.setup = function() {
    canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container-3');
  };

  p.draw = function() {
    p.background(250);

    // Pan & Zoom
    p.translate(p.width / 2 + offsetX, p.height / 2 + offsetY);
    p.scale(zoom);
    p.translate(-p.width / 2, -p.height / 2);

    drawGrid();
    drawPrimitives();

    // 시간 흐름 증가
    t += 0.02;
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
    // ✨ 움직임을 위한 offset 값
    let moveX = p.sin(t) * 30;
    let moveY = p.cos(t) * 15;

    // Rectangle (좌우 이동)
    p.fill(255, 100, 100);
    p.rect(120 + moveX, 80, 100, 60);

    // Ellipse (상하 이동)
    p.fill(100, 180, 255);
    p.ellipse(350, 200 + moveY, 90, 90);

    // Line (대각선 이동)
    p.stroke(80, 200, 120);
    p.strokeWeight(4);
    p.line(500 + moveX, 100 + moveY, 700 + moveX, 300 + moveY);

    // Triangle (반대 방향 이동)
    p.noStroke();
    p.fill(255, 220, 80);
    p.triangle(
      600 - moveX, 80 + moveY,
      750 - moveX, 60 + moveY,
      700 - moveX, 200 + moveY
    );
  }

  p.mouseWheel = function(event) {
    
    let zoomFactor = 1.1;
    if (canvas && canvas.elt.matches(':hover')) {
      if (event.delta > 0) {
        zoom /= zoomFactor;
      } else {
        zoom *= zoomFactor;
      }
      zoom = p.constrain(zoom, 0.2, 5);
      return false;
    }
  };

  p.mousePressed = function() {
    if (canvas && canvas.elt.matches(':hover') && p.mouseButton === p.LEFT && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      isDragging = true;
      lastMouseX = p.mouseX;
      lastMouseY = p.mouseY;
    }
  };

  p.mouseDragged = function() {
    if (isDragging && canvas && canvas.elt.matches(':hover')) {
      offsetX += p.mouseX - lastMouseX;
      offsetY += p.mouseY - lastMouseY;
      lastMouseX = p.mouseX;
      lastMouseY = p.mouseY;
    }
  };

  p.mouseReleased = function() {
    isDragging = false;
  };
};

var myp5_3 = new p5(sketch3, 'canvas-container-3');
