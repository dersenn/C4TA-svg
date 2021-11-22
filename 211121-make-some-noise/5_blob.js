// SETUP STUFF
let doLoop = true

function loop() {
  // doesn't work. because it doesn't get to the rAF call...
  doLoop = true
}
function noLoop() {
  doLoop = false
}

//drehung
lineRotation = function ({ point, long, rotation }) {
    return [
        { x: point.x, y: point.y },
        { x: point.x + Math.sin(rotation) * long, y: point.y + Math.cos(rotation) * long }
    ];
};

let simplex = new SimplexNoise();


// SETUP

let nPoints = 100
let aStep = 2 * Math.PI/nPoints

// 5 is the max... :-(
let nBlobs = 5

let maxLength = ngn.width/2
let amp = 2
let minLength = maxLength / amp//maxLength - maxLength / amp

let noiseMax = 4
let res = .6
let speed = 2000

// DRAW STUFF

for (let b = 0; b < nBlobs; b++) {
  svg.makeLine({
    parent: dom.svgLayer,
    id: "blob" + b,
    color: "#0f0",
    cap: "round",
    stroke: .2
  })
}

let a = 0
let sizeStep = (maxLength - minLength) / nBlobs

function draw(t) {

  let aInc = -t / 10 / (Math.PI * 2)

  let blobs = []

  for (let b = 0; b < nBlobs; b++) {
    maxLength = minLength + b * sizeStep
    let points = []
    for (let i = 0; i < nPoints; i++) {
      a = aInc + i * aStep

      // THIS! Polar Noise Loop. Use for other loopy stuff.
      // https://www.youtube.com/watch?v=ZI1dmHv3MeM&t=4s
      let xOff = mapValues(Math.cos(a), -1, 1, 0, noiseMax)
      let yOff = mapValues(Math.sin(a), -1, 1, 0, noiseMax)
      
      let wiggle = simplex.noise3D(xOff * res, yOff * res, t/speed)
      // console.log(perlin)

      radius = mapValues(wiggle, -1, 1, minLength, maxLength)

      let pt = {x: Math.cos(a) * radius, y: Math.sin(a) * radius}

      points.push(pt)
    }
    blobs.push(points)

    // WTF!!!!
    // maxLength -= .01

  }
  // console.log(blobs)

  for (let b = 0; b < nBlobs; b++) {
    let path = svg.paths(blobs, true)
    dom["blob"+b].setAttributeNS(null, "d", path)
  }

  if (doLoop) {
    requestAnimationFrame(draw)
  }
}

draw(0)


