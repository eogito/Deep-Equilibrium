let xSlider;

function setup() {
  createCanvas(800, 600);
  // Create a slider with a range from 0 to 700 (so the square stays fully visible)
  // and set the initial value to 350.
  xSlider = createSlider(0, 50, 0);
  xSlider.position(-40, 300); // Position it near the left edge
  xSlider.style('transform', 'rotate(-90deg)'); // Rotate the slider to make it vertical
  xSlider.style('width', '200px'); // Adjust the width to match the vertical orientation
  xSlider.style('background', '#ddd'); // Set the background color of the slider
  xSlider.style('outline', 'none'); // Remove the outline
  xSlider.style('border-radius', '10px'); // Add rounded corners
  xSlider.style('border', '1px solid #aaa'); // Add a border
}

function draw() {
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 1, 0); // Reverse the gradient direction
        let c = lerpColor(color(0, 0, 0), color(0, 0, 255), inter);
        stroke(c);
        line(0, y, width, y);
      }
  // Get the current slider value for the x position of the square
  let x = 400;
  // Center the square vertically in the canvas
  let y = (height - 100) / 2;
  
  fill(0, 150, 255);
  rect(x, y, 100, 100);
  
  // Display the current slider value on the canvas
  fill(0);
  textSize(16);
  text("speed (km/h): " + xSlider.value()/100, 20, 190);
}   