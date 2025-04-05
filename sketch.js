let xSlider;
let guyImage;
let playerX;
let playerY;
let sliderY;
let speed;
let targetSpeed = 60;
let nitrogenLevel = 0;
let maxNitrogenLevel = 100;
let dangerThreshold = 80;
let gameOver = false;
let gameWin = false;
let prevNitrogen = 0;

let introMode = true;
let sixtyFootPauseTriggered = false;
let thirtyFootPauseTriggered = false;
let fifteenFootPauseTriggered = false;
let textBoxIndex = 0;

nitrogenLevel = 0;
let textBoxes = [
  "Wow, it seems I went too far down. I need to get back up!",
  "Right now, at a depth of 120 ft or 36.576 meters, the water exerts around 3.5 atm of pressure on me!",
  "This is because pressure P = ρgh, where ρ is the density of water, g is the acceleration due to gravity, and h is the depth.",
  "In this case, ρ = 1000 kg/m^3, g = 9.81 m/s^2, and h = 36.576 m.",
  "So P = 1000 * 9.81 * 36.576 = 358,810 Pa, or about 3.5 atm.",
  "Adding the 1 atm of pressure from the atmosphere at sea level (h=0), I am under a total of 4.5 atm of pressure!",
  "Wow! That's a lot of pressure!",
  "Use the slider on the left to control my ascent speed!",
  "Be careful though, if I go up too fast, I might get the bends!",
  "The bends, or decompression sickness, is caused by the formation of nitrogen bubbles in the blood and tissues!",
  "Ouch!",
  "Lets start at 60 ft/min until I reach 60 ft.",
  "Beware of my nitrogen levels. Make sure it doesn't go too high!", 
  "If I go up too fast, the nitrogen in my blood will come out of solution and form bubbles, but if I go too slow, my body, which isn't immediately in equilibrium with the surrounding environment, will have more time to absorb nitrogen!"
  // Add more text boxes as needed
];

function preload() {
    guyImage = loadImage('guy.png');
}

function setup() {
  canvas = createCanvas(1920, 910);
  canvas.parent('canvas-container');
  xSlider = createSlider(0, 120, 0);
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
  background(0);
  let totalGradientHeight = 1000;
  let visibleTop = sliderY / 6;
  let visibleBottom = visibleTop + height;
  for (let y = 0; y < height; y++) {
    let gradientY = map(y, 0, height, visibleTop, visibleBottom);
    let inter = map(gradientY, 0, totalGradientHeight, 1, 0);
    inter = constrain(inter, 0, 1);
    
    let c = lerpColor(color(0, 0, 40), color(0, 100, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }
  for (let i = 0; i < 30; i++) {
    let y = ((i * 40) - (sliderY % 40)) + map(sin(frameCount * 0.01 + i), -1, 1, -5, 5);
    if (y > 0 && y < height) {
      stroke(255, 255, 255, 25);
      strokeWeight(2);
      // Create a wavy line
      beginShape();
      for (let x = 0; x < width; x += 20) {
        let waveY = y + map(sin(x * 0.01 + frameCount * 0.05), -1, 1, -8, 8);
        vertex(x, waveY);
      }
      endShape();
    }
  }
  
  // Draw bubbles
  for (let i = 0; i < 20; i++) {
    let x = ((i * 100) % width) + 50;
    let y = (height - (frameCount + i*200) % (height*1.5)) - sliderY/10;
    if (y > 0 && y < height) {
      noStroke();
      fill(255, 255, 255, 80);
      ellipse(x, y, 10, 10);
      fill(255, 255, 255, 40);
      ellipse(x + 200, y + 100, 15, 15);
      fill(255, 255, 255, 60);
      ellipse(x + 400, y - 50, 8, 8);
    }
  }
  speed = xSlider.value()/20;

  if (speed > 0) {
    nitrogenLevel += abs(20*speed-targetSpeed) * 0.01; // Increase nitrogen level based on speed
  } else {
    nitrogenLevel = max(0, nitrogenLevel - 0.3);
  }
  
  nitrogenLevel = constrain(nitrogenLevel, 0, maxNitrogenLevel);
  
  // Draw nitrogen meter
  let meterHeight = 300;
  let meterWidth = 30;
  let meterX = width - 60;
  let meterY = height/2 - meterHeight/2;
  
  // Draw meter background
  fill(50);
  rect(meterX, meterY, meterWidth, meterHeight, 10);
  
  let fillHeight = map(nitrogenLevel, 0, maxNitrogenLevel, 0, meterHeight);
  let fillColor;
  
  if (nitrogenLevel < dangerThreshold * 0.5) {
    // Safe level - green
    fillColor = color(0, 255, 0);
  } else if (nitrogenLevel < dangerThreshold) {
    // Warning level - yellow
    fillColor = color(255, 255, 0);
  } else {
    // Danger level - red
    fillColor = color(255, 0, 0);
  }
  
  fill(fillColor);
  rect(meterX, meterY + meterHeight - fillHeight, meterWidth, fillHeight, 10);
  
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("N₂", meterX + meterWidth/2, meterY - 20);
  
  if (nitrogenLevel >= dangerThreshold && !introMode) {
    fill(255, 0, 0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("WARNING: Nitrogen level too high!\nRisk of bends!", width/2, 100);
    
    if (nitrogenLevel > dangerThreshold + 10) {
      fill(255, 0, 0, map(nitrogenLevel, dangerThreshold, maxNitrogenLevel, 0, 100));
      rect(0, 0, width, height);
    }
  }
  if (nitrogenLevel >= 99) {
    gameOver = true;
    console.log("failing!!")
  }
  if (sliderY <= 3*height-170 && !sixtyFootPauseTriggered) {
    prevNitrogen = nitrogenLevel;
    // Trigger another pause and text boxes
    targetSpeed = 30;
    introMode = true;
    textBoxIndex = 0;
    textBoxes = [
      "I've reached 60ft!",
      "Here, at 60 ft, or 18.3 meters, I am at around 2.8 atm of pressure!",
      "I should probably explain why I'm so worried about getting the bends.",
      "In short, the oxygen in my air tank is the same as good old regular air, 21% oxygen and 79% nitrogen.", 
      "However, as I descended, the total pressure increased.", 
      "The total pressure is the sum of partial pressures, and since the air is 79% nitrogen, the partial pressure of nitrogen in my blood at sea level (1 atm) is 0.79 atm.",
      "However, here, at 2.8 atm, the air is still 79% nitrogen, so the partial pressure of nitrogen is 2.8 * 0.79 = 2.21 atm!",
      "From the ideal gas law, PV = nRT, we can see that n/V = P/(RT).",  
      "Since the volume of my body stays the same, and assuming the temperature stays constant, the concentration of dissolved nitrogen in my blood almost tripled!",
      "However, as I ascend, the pressure decreases, and the nitrogen will come out of my blood as well.",
      "If too much comes out too quickly, bubbles can form!",  
      "This can be attributed to Le Chatelier's principle, which states that a system at equilibrium will shift to counteract any stresses applied.", 
      "In this case, the system is a solubility equilibrium (the amount of nitrogen dissolved in my blood compared to the amount as a gas), and the stress is the decrease in pressure as I ascend.",
      "In short, the equilibrium is N2(aq) <-> N2(g), and the decrease in pressure causes the equilibrium to shift to the left towards the side with more moles of gas to increase the pressure, causing nitrogen to come out of solution and form bubbles.", 
      "Not fun!", 
      "Let's slow down and go at 30 ft/min until I reach 30 ft."
    ];
    sixtyFootPauseTriggered = true;
  }
  if (sliderY <= 3*height/2-85 && !thirtyFootPauseTriggered) {
    prevNitrogen = nitrogenLevel;
    // Trigger another pause and text boxes
    targetSpeed = 15;
    introMode = true;
    textBoxIndex = 0;
    textBoxes = [
      "I've reached 30ft!",
      "Here, at 30 ft, or 9 meters, I am at around 1.9 atm of pressure!",
      "You might be wondering why I am slowing down as I go up.", 
      "This can be explained neatly through Henry's Law, which states that S = kP, where S is the solubility of a gas in a liquid, k is a constant, and P is the partial pressure of the gas!", 
      "Essentially, as I ascend, the total pressure I am under (and subsequently the partial pressure of nitrogen, since the total pressure is the sum of partial pressures) decreases.",
      "This then decreases the solubility of nitrogen in my blood, causing dissolved nitrogen to come out and form bubbles in my tissues.",
      "Since S = kP, the solubility of nitrogen in my blood is directly proportional to the partial pressure of nitrogen.",
      "This means that as I ascended from 120 ft (4.5 atm) to 60 ft (2.8 atm), the partial pressure and the solubility of nitrogen in my blood decreased by 38%.",
      "Then, as I ascended from 60 ft (2.8 atm) to 30 ft (1.9 atm), the partial pressure and solubility of nitrogen in my blood decreased by 32%.", 
      "That means that around the same amount of nitrogen in my blood was released during both of these ascents, despite the first being 60 ft and the second being 30 ft!",
      "Proportionally, the amount of nitrogen dissolving out of my blood compared to the amount of distance I ascend is only going to go up from here as we get closer to the surface!", 
      "That is why I need to slow down even more as I ascend!",
      "Let's slow down and go at 15 ft/min until I reach 15 ft."
    ];
    thirtyFootPauseTriggered = true;
  }
  if (sliderY <= 3*height/4-42.5 && !fifteenFootPauseTriggered) {
    prevNitrogen = nitrogenLevel;
    // Trigger another pause and text boxes
    introMode = true;
    textBoxIndex = 0;
    textBoxes = [
      "I've reached 15 ft!",
      "Here, at 15 ft, or 4.6 meters, I am at around 1.4 atm of pressure!",
      "You might be wondering why I'm so worried about nitrogen bubbling out, even though there's oxygen in my blood too!",
      "This is because unlike nitrogen, oxygen is constantly being used up by my body for cellular respiration.",
      "As a result, it doesn't accumulate in my tissues like nitrogen does."
    ];
    fifteenFootPauseTriggered = true;
  }
  if (introMode) {
    nitrogenLevel = prevNitrogen; // Reset nitrogen level to previous value
    xSlider.elt.disabled = true;
    speed = 0; // Stop the player from moving during intro mode
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
  

  if (sliderY > -340) {
    sliderY = max(-340, sliderY - speed);
  }
  if (sliderY <= -339) {
    gameWin = true;
  }

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
  if (nitrogenLevel >= maxNitrogenLevel) {
    gameOver = true;
  }
  if (gameWin) {
    speed = 0;
    xSlider.value(0);
    xSlider.elt.disabled = true;
    
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);
    fill(0, 255, 0);
    textSize(72);
    textAlign(CENTER, CENTER);
    text("YOU WIN", width/2, height/2 - 100);
    
    fill(255);
    textSize(36);
    text("You have successfully reached the top without", width/2, height/2);
    text("getting the bends", width/2, height/2 + 50);
    fill(0, 200, 0);
    rect(width/2 - 100, height/2 + 150, 200, 60, 10);
    fill(255);
    textSize(24);
    text("MORE INFO", width/2, height/2 + 180);
  }
  if (gameOver) {
    speed = 0;
    xSlider.value(0);
    xSlider.elt.disabled = true;
    
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);
    fill(255, 0, 0);
    textSize(72);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2 - 100);
    
    fill(255);
    textSize(36);
    text("Decompression sickness (the bends) has occurred", width/2, height/2);
    text("Nitrogen bubbles have formed in your bloodstream", width/2, height/2 + 50);
    fill(0, 200, 0);
    rect(width/2 - 100, height/2 + 150, 200, 60, 10);
    fill(255);
    textSize(24);
    text("RESTART", width/2, height/2 + 180);
  }
}

function mousePressed() {
  if (introMode) {
    textBoxIndex++;
    if (textBoxIndex >= textBoxes.length) {
      introMode = false;
    }
  }
  if (gameWin) {
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
        mouseY > height/2 + 150 && mouseY < height/2 + 210) {
      window.location.href = "info.html";
    }
    return;
  }
  if (gameOver) {
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
        mouseY > height/2 + 150 && mouseY < height/2 + 210) {
      nitrogenLevel = 0;
      sliderY = 6*height;
      gameOver = false;
      introMode = true;
      textBoxIndex = 0;
      sixtyFootPauseTriggered = false;
      thirtyFootPauseTriggered = false;
      xSlider.value(0);
      xSlider.elt.disabled = false;
      targetSpeed = 60; // Reset speed
      prevNitrogen = 0; // Reset nitrogen level
      
      // Reset to original text boxes
      textBoxes = [
        "Wow, it seems I went too far down. I need to get back up!",
        "Right now, at a depth of 120 ft or 36.576 meters, the water exerts around 3.5 atm of pressure on me!",
        "This is because pressure P = ρgh, where ρ is the density of water, g is the acceleration due to gravity, and h is the depth.",
        "In this case, ρ = 1000 kg/m^3, g = 9.81 m/s^2, and h = 36.576 m.",
        "So P = 1000 * 9.81 * 36.576 = 358,810 Pa, or about 3.5 atm.",
        "Adding the 1 atm of pressure from the atmosphere at sea level (h=0), I am under a total of 4.5 atm of pressure!",
        "Use the slider on the left to control my ascent speed!",
        "Be careful though, if I go up too fast, I might get the bends!",
        "Lets start at 60 ft/min until I reach 60 ft.",
        "Beware of my nitrogen levels. Make sure it doesn't go too high!"
      ];
    }
    return;
  }
  
  if (introMode) {
    textBoxIndex++;
    if (textBoxIndex >= textBoxes.length) {
      introMode = false;
    }
  }
}