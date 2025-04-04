let xSlider;
let guyImage;
let playerX;
let sliderY;

function preload() {
    guyImage = loadImage('guy.png');
}

function setup() {
  canvas = createCanvas(1920, 910);
  canvas.parent('canvas-container');
  xSlider = createSlider(0, 50, 0);
  xSlider.style('transform', 'rotate(-90deg)');
  xSlider.style('width', '200px');
  xSlider.style('background', '#ddd');
  xSlider.style('outline', 'none');
  xSlider.style('border-radius', '10px');
  xSlider.style('border', '1px solid #aaa');
  playerX = width / 2; // Start at the center of the canvas
  sliderY = 6*height; // Center vertically

}

function draw() {
  let canvasPosition = canvas.position();
  xSlider.position(canvasPosition.x - 40, canvasPosition.y + height / 2);
  for (let y = 0; y < height; y++) {
      let inter = map(y, 0, height, 1, 0);
      let c = lerpColor(color(0, 0, 0), color(0, 0, 255), inter);
      stroke(c);
      line(0, y, width, y);
    }
    if (keyIsDown(65)) { // ASCII code for 'A'
      playerX -= 10; // Move left by 10 pixels
  }
  sliderY -= xSlider.value()/10;
  // Move the player right when 'D' is pressed
  if (keyIsDown(68)) { // ASCII code for 'D'
      playerX += 10; // Move right by 10 pixels
  }

  // draw depth meter
  stroke(255);
  line(15, height, 15, 0); // draw depth meter line
  
  // draw large ticks every 5 feet
  for (let i = 130; i >= 0; i -= 5) {
    let y = map(i, 130, 0, 0, height*6.5) - sliderY;
    if (y > 0 && y < height) {
      line(5, y, 25, y); // draw large tick
      fill(255);
      textSize(12);
      textAlign(RIGHT, CENTER);
      text((130-i) + ' ft', 50, y); // draw depth label
    }
  }
  
  // draw small ticks every 1 foot
  for (let i = 130; i >= 0; i -= 1) {
    let y = map(i, 130, 0, 0, height*6.5) - sliderY;
    if (y > 0 && y < height) {
      line(10, y, 20, y); // draw small tick
    }
  }
  
  // draw depth slider
  fill(255);
  noStroke();
  rect(0, map(xSlider.value(), 0, 130, 0, height) - sliderY, 5, 20); // draw depth slider

  playerX = constrain(playerX, 0, width - guyImage.width);
  // image(guyImage, playerX, playerY);
  image(guyImage, playerX, (height - guyImage.height) / 2-60);
  fill(0);
  textSize(16);
  text("speed (km/h): " + xSlider.value()/100, 20, 190);
}