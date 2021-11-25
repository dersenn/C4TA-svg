// FUNCTIONS

svg.lineSoft = function (ia, close = false) {
  //clone first and last point
  ia.unshift(ia[0]);
  // ia.push(ia[ia.length - 1]);

  // add the first point to the end to close the shape
  if (close) {
    ia.push(ia[0]);
  } else {
    ia.push(ia[ia.length - 1]);
  }
  let output = "M ";
  for (let i = 1; i < ia.length; i++) {
      output += (ia[i - 1].x + ia[i].x) / 2 * ngn.res + "," + (ia[i - 1].y + ia[i].y) / 2 * ngn.res + " Q";
      output += ia[i].x * ngn.res + "," +ia[i].y * ngn.res + " ";
  }
  //end point
  output += ia[ia.length - 1].x * ngn.res + "," + ia[ia.length - 1].y * ngn.res + " ";
  return output;
};

svg.cubicBezier = function (ia, close = false) {
  let output = "M 0,0"

  if (close) {
    ia.push(ia[0])
  }

  return output;
};

// from this: http://scaledinnovation.com/analytics/splines/aboutSplines.html
function getControlPoints(x0, y0, x1, y1, x2, y2, t){
  let d01 = Math.sqrt(Math.pow(x1-x0, 2) + Math.pow(y1-y0, 2)); // distance between pt1 and pt2
  let d12 = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2)); // distance between pt2 and pt3
  let fa = t * d01 / (d01+d12);   // scaling factor for triangle Ta
  let fb = t * d12 / (d01+d12);   // ditto for Tb, simplifies to fb=t-fa
  let p1x = x1-fa * (x2-x0);    // x2-x0 is the width of triangle T
  let p1y = y1-fa * (y2-y0);    // y2-y0 is the height of T
  let p2x = x1+fb * (x2-x0);
  let p2y = y1+fb * (y2-y0);  
  return [{x: p1x, y: p1y}, {x: p2x, y: p2y}];
}


// SETUP
let simplex = new SimplexNoise();

let maxLength = ngn.width/2
let amp = 2
let minLength = maxLength / amp//maxLength - maxLength / amp

let nPoints = 5
let points = []

let aStep = 2 * Math.PI/nPoints
let a = 0

let noiseMax = 4
let res = .6


// for (let p = 0; p < nPoints; p++) {
//   points.push({
//     x: mapValues(Math.random(), 0, 1, -ngn.width/2, ngn.width/2), 
//     y: mapValues(Math.random(), 0, 1, -ngn.height/2, ngn.height/2)
//   })
// }


for (let i = 0; i < nPoints; i++) {
  a = i * aStep

  let xOff = mapValues(Math.cos(a), -1, 1, 0, noiseMax)
  let yOff = mapValues(Math.sin(a), -1, 1, 0, noiseMax)
  
  let wiggle = simplex.noise3D(xOff * res, yOff * res, 1)

  radius = mapValues(wiggle, -1, 1, minLength, maxLength)

  let pt = {x: Math.cos(a) * radius, y: Math.sin(a) * radius}

  points.push(pt)
}

// console.log(points)

// DRAW

// the grey line
svg.makeLine({
  parent: dom.svgLayer,
  id: "softLine",
  color: "#ddd",
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

// the green line
svg.makeLine({
  parent: dom.svgLayer,
  id: "bezier",
  color: "#0f0",
  cap: "round",
  stroke: .2
})

// the green points (controlpoints)
svg.makeLine({
  parent: dom.svgLayer,
  id: "cPoints",
  color: "#0ff",
  cap: "round",
  stroke: 1
})


let path = svg.lineSoft(points, false)
let thepoints = svg.dots(points)

let cBezier = svg.cubicBezier(points, false)

let controlPts = getControlPoints(
  points[2].x, points[2].y, 
  points[3].x, points[3].y, 
  points[4].x, points[4].y,
  .5
  )

let cPoints = svg.dots(controlPts, false)

console.log(controlPts)
console.log(cPoints)

dom["softLine"].setAttributeNS(null, "d", path)
dom["points"].setAttributeNS(null, "d", thepoints)

dom["bezier"].setAttributeNS(null, "d", cBezier)
dom["cPoints"].setAttributeNS(null, "d", cPoints)

// ANIMATE
// No Animation yet ¯\_(ツ)_/¯

function draw(t) {

  requestAnimationFrame(draw)
}

draw(0)