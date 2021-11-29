// FUNCTIONS


svg.bezierPath = function(pts, t, closed = false) {
  let cp = []   // array of control points, as x0,y0,x1,y1,... CHANGED TO {cp1}, {cp2}
  let n = pts.length
  let output = ""

  if (closed) {
    // Append and prepend first and last point to generate control points
    pts.push(pts[0])
    pts.unshift(pts[n-2])
    for (let i = 0; i < pts.length - 2; i++) {
      // cp = cp.concat(getControlPoints(pts[i],pts[i+1],pts[i+2], t))
      cp.push(getControlPoints(pts[i], pts[i+1], pts[i+2], t))
    }
    console.log(pts)
    console.log(cp)
    output += "M " + pts[1].x * ngn.res + "," + pts[1].y * ngn.res + " " +
      "C " + cp[0][1].x  * ngn.res + "," + cp[0][1].y * ngn.res + " " + cp[1][0].x * ngn.res + "," + cp[1][0].y * ngn.res + " " + pts[2].x * ngn.res + "," + pts[2].y * ngn.res + " " +
      "C " + cp[1][1].x * ngn.res + "," + cp[1][1].y  * ngn.res+ " " + cp[2][0].x * ngn.res + "," + cp[2][0].y * ngn.res + " " + pts[3].x * ngn.res + "," + pts[3].y * ngn.res + " " + 
      "C " + cp[2][1].x * ngn.res + "," + cp[2][1].y  * ngn.res+ " " + cp[3][0].x * ngn.res + "," + cp[3][0].y * ngn.res + " " + pts[4].x * ngn.res + "," + pts[4].y * ngn.res + " " +
      "C " + cp[3][1].x * ngn.res + "," + cp[3][1].y  * ngn.res+ " " + cp[0][0].x * ngn.res + "," + cp[0][0].y * ngn.res + " " + pts[1].x * ngn.res + "," + pts[1].y * ngn.res + " "
  } else {

  }

  return output

}

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

let points = [{x: -ngn.width/2 + 10, y: 0}, {x: 0, y: ngn.height/2 - 10 }, {x: ngn.width/2 - 10, y: 0}, {x: 0, y: -ngn.height/2 + 10 }]


let thepoints = svg.dots(points)
let cPoints = getControlPoints(points[0], points[1], points[2])
let cPts = svg.dots(cPoints)
// console.log(cp)
// let cPts = svg.dots(cp)


let testPath = 
  "M " + points[0].x * ngn.res + "," + points[0].y * ngn.res + " "
  + "C " 
  + points[0].x * ngn.res + "," + points[1].y * ngn.res + " " 
  + points[0].x * ngn.res + "," + points[1].y * ngn.res + " " 
  + points[1].x * ngn.res + "," + points[1].y * ngn.res
  // + " z"

// really need to rewrite the engine... this ngn.res thing is confusing to me.
// don't know when and where to use it or not...

// console.log(testPath)

let cubicPath = svg.bezierPath(points, .5, true)
console.log(cubicPath)


dom["points"].setAttributeNS(null, "d", thepoints)
dom["bezier"].setAttributeNS(null, "d", testPath)
dom["cubic"].setAttributeNS(null, "d", cubicPath)
dom["control"].setAttributeNS(null, "d", cPts)





// My only friend, the End.