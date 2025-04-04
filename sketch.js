let xSlider;
let guyImage;
let playerX;
let playerY;

function preload() {
    guyImage = loadImage('guy.png');
}

function setup() {
  canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');
  xSlider = createSlider(0, 50, 0);
  xSlider.style('transform', 'rotate(-90deg)');
  xSlider.style('width', '200px');
  xSlider.style('background', '#ddd');
  xSlider.style('outline', 'none');
  xSlider.style('border-radius', '10px');
  xSlider.style('border', '1px solid #aaa');
  playerX = width / 2; // Start at the center of the canvas
  playerY = (height - guyImage.height) / 2-60; // Center vertically

}
 vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv 
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
    playerY -= xSlider.value()/10;
    // Move the player right when 'D' is pressed
    if (keyIsDown(68)) { // ASCII code for 'D'
        playerX += 10; // Move right by 10 pixels
    }
    playerX = constrain(playerX, 0, width - guyImage.width);
  image (guyImage, playerX, playerY);
  fill(0);
  textSize(16);
  text("speed (km/h): " + xSlider.value()/100, 20, 190);
}