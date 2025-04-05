let xSlider;
let guyImage;
let playerX;
let playerY;
let sliderY;

let introMode = true;
let textBoxIndex = 0;
let textBoxes = [
  "Text box 1",
  "Text box 2",
  "Text box 3",
  // Add more text boxes as needed
];

function preload() {
    guyImage = loadImage('guy.png');
}

function setup() {
  canvas = createCanvas(1920, 910);
  canvas.parent('canvas-container');
  xSlider = createSlider(0, 60, 0);
  xSlider.style('transform', 'rotate(-90deg)');
  xSlider.style('width', '200px');
  xSlider.style('background', '#ddd');
  xSlider.style('outline', 'none');
  xSlider.style('border-radius', '10px');
  xSlider.style('border', '1px solid #aaa');
  playerX = width / 2; // Start at the center of the canvas
  playerY = (height - guyImage.height) / 2-60; // Center vertically
  sliderY = 6*height; // Set the initial position of the slider

}

function draw() {
  let canvasPosition = canvas.position();
  xSlider.position(canvasPosition.x, canvasPosition.y + height / 2);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 1, 0);
    let c = lerpColor(color(0, 0, 0), color(0, 0, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }

  if (introMode) {
    xSlider.elt.disabled = true;
    // Draw the text box
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(textBoxes[textBoxIndex], width / 2, height - 100);
  } else {
    xSlider.elt.disabled = false;
    if (keyIsDown(65)) playerX -= 10; // Move left by 10 pixels
    if (keyIsDown(68)) playerX += 10; // Move right by 10 pixels
  }

  if (sliderY > -340) sliderY = max(-340, sliderY - xSlider.value()/20);

  // draw depth meter
  stroke(255);
  line(15, height, 15, 0); // draw depth meter line
  
  // draw large ticks every 5 feet
  for (let i = 120; i >= 0; i -= 1) {
    let y = map(i, 120, 0, 0, height*6.5) - sliderY;
    if (y > 0 && y < height) {
      if (i % 5 === 0) {
        line(5, y, 25, y); // draw large tick
        textSize(12);
        textAlign(RIGHT, CENTER);
        text((120-i) + ' ft', 60, y); // draw depth label
      } else {
        line(10, y, 20, y); // small tick
      }
      fill(255);
    }
  }

  playerX = constrain(playerX, 0, width - guyImage.width);
  image(guyImage, playerX, playerY);
  fill(0);
  textSize(16);
  text("speed (ft/min): " + xSlider.value(), 160, 300);
  text("sliderY: " + sliderY, 160, 330);
}

function mousePressed() {
  if (introMode) {
    textBoxIndex++;
    if (textBoxIndex >= textBoxes.length) {
      introMode = false;
    }
  }
}