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

svg.bezierPath = function(pts, t, closed) {
  // "t" defines the width of the handles (for smooth curves 0.1—0.9, around .3/.5 looks best.)
  let cp = []
  let n = pts.length
  let output = ""

  // Append and prepend first and last point to generate control points
  pts.push(pts[0])
  pts.unshift(pts[n-1])
  for (let i = 0; i < n; i++) {
    cp.push(getControlPoints(pts[i], pts[i+1], pts[i+2], t))
  }
  // to make the loop afterwards a bit easier do the same for generated cps.
  cp.push(cp[0])
  cp.unshift(cp[n-1])

  output += "M " + pts[1].x * ngn.res + "," + pts[1].y * ngn.res + " "

  if (closed) {
    for (let i = 1; i < n+1; i++) {
      let cp1 = cp[i][1]
      let cp2 = cp[i+1][0]
      let ep = pts[i+1]

      output += "C " + 
        cp1.x * ngn.res + "," + cp1.y * ngn.res + " " + 
        cp2.x * ngn.res + "," + cp2.y * ngn.res + " " + 
        ep.x * ngn.res + "," + ep.y * ngn.res
    }
  } else {
    // need to change to quadratic bezier for first and last point. see example.js
    // so, not quite there yet
    for (let i = 1; i < n; i++) {
      let cp1 = cp[i][1]
      let cp2 = cp[i+1][0]
      let ep = pts[i+1]

      output += "C " + 
        cp1.x * ngn.res + "," + cp1.y * ngn.res + " " + 
        cp2.x * ngn.res + "," + cp2.y * ngn.res + " " + 
        ep.x * ngn.res + "," + ep.y * ngn.res
    }
  }
  output += " z"
  return output
}

// adapted from this: http://scaledinnovation.com/analytics/splines/aboutSplines.html
function getControlPoints(p0, p1, p2, t) {
  let d01 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)); // distance between pt1 and pt2
  let d12 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)); // distance between pt2 and pt3
  let fa = t * d01 / (d01+d12);   // scaling factor for triangle Ta
  let fb = t * d12 / (d01+d12);   // ditto for Tb, simplifies to fb=t-fa
  let cp1x = p1.x - fa * (p2.x - p0.x);    // x2-x0 is the width of triangle T
  let cp1y = p1.y - fa * (p2.y - p0.y);    // y2-y0 is the height of T
  let cp2x = p1.x + fb * (p2.x - p0.x);
  let cp2y = p1.y + fb * (p2.y - p0.y);  
  return [{x: cp1x, y: cp1y}, {x: cp2x, y: cp2y}];
}

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

let noiseMax = 20 // what's this for again???
let res = 1
let speed = 2000

let nPts = 8
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
  dom["blob"].setAttributeNS(null, "d", svg.bezierPath(points, .4, true))
  // dom["wierdo"].setAttributeNS(null, "d", svg.bezierPath(points, edgy, true))

  requestAnimationFrame(draw)
}

draw(0)




// My only friend, the End.