// DRAW

// the blob
svg.makeShape({
  parent: dom.svgLayer,
  id: "blob",
  color: "#0f0",
  cap: "round",
  stroke: .2
})

// the red dots
svg.makeLine({
  parent: dom.svgLayer,
  id: "points",
  color: "#f00",
  cap: "round",
  stroke: 1
})

// SETUP

let simplex = new SimplexNoise();

let maxLength = ngn.min/2
let minLength = maxLength/3

let noiseMax = 4 // what's this for again???
let res = 1
let speed = 2000

let nPts = 5
let aStep = -Math.PI*2 / nPts


// ANIMATE

function draw(t) {
  let points = []

  for (let p = 0; p < nPts; p++) {
    let a = p * aStep

    let xOff = mapValues(Math.cos(a), -1, 1, 0, noiseMax)
    let yOff = mapValues(Math.sin(a), -1, 1, 0, noiseMax)
    
    let wobble = simplex.noise3D(xOff * res, yOff * res, t/speed)
    let radius = mapValues(wobble, -1, 1, minLength, maxLength)

    let pt = {x: Math.cos(a) * radius, y: Math.sin(a) * radius}

    points.push(pt)
  }

  let xOff = mapValues(Math.cos(t * aStep), -1, 1, 0, 1)
  let yOff = mapValues(Math.sin(t * aStep), -1, 1, 0, 1)

  dom["points"].setAttributeNS(null, "d", svg.dots(points))
  dom["blob"].setAttributeNS(null, "d", svg.bezierPath(points, .4, true))

  requestAnimationFrame(draw)

}

draw(0)






// My only friend, the End.