// FUNCTIONS


svg.bezierPath = function(pts, t, closed) {
  let cp = []   // array of control points, as x0,y0,x1,y1,... CHANGED TO {cp1}, {cp2}
  let n = pts.length
  let output = ""

  if (closed) {
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
    // add option for non-closed path (quadratic beziers at beginning/end?)
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
  let cp2y = p1.y + fb * (p2.y - p0.y);  
  return [{x: cp1x, y: cp1y}, {x: cp2x, y: cp2y}];
}

// DRAW

// the red dots (the points)
// the bezier line
svg.makeLine({
  parent: dom.svgLayer,
  id: "cubic",
  color: "#0f0",
  cap: "round",
  stroke: .2
})

svg.makeLine({
  parent: dom.svgLayer,
  id: "points",
  color: "#f00",
  cap: "round",
  stroke: 1
})

let points = [{x: -ngn.width/2 + 10, y: 0}, {x: 0, y: ngn.height/2 - 10 }, {x: ngn.width/2 - 10, y: 0}, {x: 0, y: -ngn.height/2 + 10 }]

let thepoints = svg.dots(points)
let cubicPath = svg.bezierPath(points, .5, true)
// console.log(cubicPath)


dom["points"].setAttributeNS(null, "d", thepoints)
dom["cubic"].setAttributeNS(null, "d", cubicPath)





// My only friend, the End.