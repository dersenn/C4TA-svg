// FUNCTIONS

svg.cubicBezier = function (ia, close = false, t = 0.5) {
  if (close) {
    ia.push(ia[0])
  }
  // move to first point
  let output = "M " + ia[0].x + "," + ia[0].y + " "

  for (let i = 0; i < ia.length; i++) {
    let p0, p1, p2

    console.log(ia.length - 1)

    if (i == 0) {
      // output +=  ia[0].x + "," + ia[0].y + " "
      // something's wrong here... 
      p0 = ia[ia.length - 1] // {x: 0, y: 0}
      p1 = ia[i]
      p2 = ia[i+1]
    } else if (i == ia.length - 1) {
      p0 = ia[i-1]
      p1 = ia[i]
      p2 = ia[0]
    } else {
      p0 = ia[i-1]
      p1 = ia[i]
      p2 = ia[i+1]
    }

    let cp = getControlPoints(p0, p1, p2, t)

    output +=
      "C "
      + cp[1].x * ngn.res + "," + cp[1].y * ngn.res + " "
      + cp[0].x * ngn.res + "," + cp[0].y * ngn.res + " "
      + p2.x * ngn.res + "," + p2.y * ngn.res + "    "
  }

  return output;
};

// adapted from this: http://scaledinnovation.com/analytics/splines/aboutSplines.html
function getControlPoints(p0, p1, p2, t = 0.5) {
  let d01 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)); // distance between pt1 and pt2
  let d12 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)); // distance between pt2 and pt3
  let fa = t * d01 / (d01+d12);   // scaling factor for triangle Ta
  let fb = t * d12 / (d01+d12);   // ditto for Tb, simplifies to fb=t-fa
  let cp1x = p1.x - fa * (p2.x - p0.x);    // x2-x0 is the width of triangle T
  let cp1y = p1.y - fa * (p2.y - p0.y);    // y2-y0 is the height of T
  let cp2x = p1.x + fb * (p2.x - p0.x);
  let cp2y = p1.y + fb * (p2.y- p0.y);  
  return [{x: cp1x, y: cp1y}, {x: cp2x, y: cp2y}];
  }

// DRAW

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

// the yellow dots
svg.makeLine({
  parent: dom.svgLayer,
  id: "control",
  color: "#ff0",
  cap: "round",
  stroke: 1
})

// the blue line
svg.makeLine({
  parent: dom.svgLayer,
  id: "cubic",
  color: "#0ff",
  cap: "round",
  stroke: .2
})

let points = [{x: -ngn.width/2 + 10, y: 0}, {x: 0, y: ngn.height/2 - 10 }, {x: ngn.width/2 - 10, y: 0}]

let cPoints = getControlPoints(points)
console.log(points)
console.log(cPoints)

let thepoints = svg.dots(points)
let cP = svg.dots(cPoints)

let bezPath
bezPath = 
  "M " + points[0].x * ngn.res + "," + points[0].y * ngn.res + " "
  + "C " 
  + points[0].x * ngn.res + "," + points[1].y * ngn.res + " " 
  + points[0].x * ngn.res + "," + points[1].y * ngn.res + " " 
  + points[1].x * ngn.res + "," + points[1].y * ngn.res
  // + " z"

// really need to rewrite the engine... this ngn.res thing is confusing to me.
// don't know when and where to use it or not...

// console.log(bezPath)

let cubicPath = bezPath

// console.log(points)
// console.log("cBezier: " + cBezier)


// dom["softLine"].setAttributeNS(null, "d", path)
dom["points"].setAttributeNS(null, "d", thepoints)
dom["bezier"].setAttributeNS(null, "d", bezPath)
dom["cubic"].setAttributeNS(null, "d", cubicPath)
dom["control"].setAttributeNS(null, "d", cP)





// My only friend, the End.