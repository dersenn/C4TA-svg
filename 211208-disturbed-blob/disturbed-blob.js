// SOME JS BASICS

// template literal, string with backticks.
let a = "literally"
let b = 1000
console.log(`you ${a} are like ${b}`)
let obj = {
  foo: 1
}

obj.bar1 = 1
obj.bar2 = 2
obj.bar3 = 3

// this works
for (let i = 1; i < 4; i++) {
  console.log(obj[`bar${i}`])
}
// this doesn't
for (let i = 1; i < 4; i++) {
  console.log(obj.bar+i)
}


// FUNCTIONS


// DRAW

// the blob
svg.makeShape({
  parent: dom.svgLayer,
  id: "blob",
  color: "#0f0",
  cap: "round",
  stroke: .2
})

// the wierdo
svg.makeLine({
  parent: dom.svgLayer,
  id: "wierdo",
  color: "#fff",
  cap: "round",
  stroke: .2
})

// the red dots (the points)
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
let minLength = maxLength / 3

let noiseMax = 4 // what's this for again???
let res = 1
let speed = 2000

let nPts = 10
let aStep = -Math.PI*2 / nPts

let edgy

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

  // something's not quite right here. last & first point don't line up.
  let xOff = mapValues(Math.cos(t * aStep), -1, 1, 0, 1)
  let yOff = mapValues(Math.sin(t * aStep), -1, 1, 0, 1)
  edgy = mapValues(simplex.noise3D(xOff * .00000001, yOff * .00000001, t/2000), -1, 1, 0, 2)

  dom["points"].setAttributeNS(null, "d", svg.dots(points))
  // dom["blob"].setAttributeNS(null, "d", svg.bezierPath(points, .4, true))
  dom["wierdo"].setAttributeNS(null, "d", svg.bezierPath(points, edgy, true))

  requestAnimationFrame(draw)

}

draw(0)




// My only friend, the End.