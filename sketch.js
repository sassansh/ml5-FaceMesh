let facemesh;
let video;
let predictions = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  textSize(20);

  facemesh = ml5.facemesh(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  // We call function to draw all keypoints
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  let conf = 0;
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;
    // Add up confidence on each face
    conf += predictions[i].faceInViewConfidence.toFixed(3);
    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];

      fill(0, 255, 0);
      stroke(0, 0, 0);
      ellipse(x, y, 5, 5);
    }
  }
  // Set colors for debug box
  fill(0, 0, 0, 100);
  stroke(0, 0, 0);
  // Draw debug box
  rect(5,5, 200, 70)

  // Set colour for debug text
  fill(255, 255, 255);
  noStroke();
  // Add debug text
  text("Faces: "+predictions.length, 10, 30);

  if (predictions.length > 0) {
    text("Confidence: "+((conf/predictions.length))*100+"%", 10, 60);
  } else {
    text("Confidence: 0%", 10, 60 );
  }
  
}