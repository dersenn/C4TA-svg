// ENGINE

/*IDEAS*/

// maybe make classes?
// should try to find out benefits of obj.literals vs. classes.
// or how to mix them.

// —— dom (probably not, as it is very static)
// —— engine
// —— svg

// difficult to separate engine from svg. maybe svg is part of engine?

// ENGINE
// —— rewrite that scale thing. it's opposed to my logic. i start from the container.


// SVG
// –– svg <g> (group) element?
// –– path constructor including line, arc and bezier (push points with arguments)
// –– create multiple svgs

// and so on...



let ngn = {}
// can i make this a class somehow? or enclosed in a function?
// like p5 setup() and draw()

// COORDINATES

ngn.scale = function ({ width, height }) {
  if (width) {
    ngn.width = width
    ngn.res = window.innerWidth / ngn.width
    ngn.height = window.innerHeight / ngn.res
  } else if (height) {
    ngn.height = height
    ngn.res = window.innerHeight / ngn.height
    ngn.width = window.innerWidth / ngn.res
  }
  ngn.center = { x: ngn.width / 2, y: ngn.height / 2}
  ngn.min = Math.min(ngn.width, ngn.height)
  ngn.max = Math.max(ngn.width, ngn.height)
  ngn.rwidth = ngn.width * ngn.res
  ngn.rheight = ngn.height * ngn.res
  // console.log(ngn)
}

ngn.scale({ height: 100})
// possibly use window dimensions?
// and some kind of mapping...


// SVG

let svg = {};

svg.nameSpace = "http://www.w3.org/2000/svg";

/*
<circle cx="50" cy="50" r="50"/>
*/
svg.path = function (ia, close = false) {
    let output = "M ";
    for (var i = 0; i < ia.length; i++) {
        output += ia[i].x * ngn.res + " " + ia[i].y * ngn.res + " ";
    }
    if (close) {
      output += "z";
    }
    return output;
};

svg.paths = function (ia, close = false) {
  let output = "";
  for (var i = 0; i < ia.length; i++) {
      output += svg.path(ia[i], close);
  }
  return output;
};

svg.dot = function(io) {
  let output = "M " + io.x * ngn.res + " " + io.y * ngn.res + " z "
  return output
}

svg.dots = function(ia) {
  let output = ""
  for(i = 0; i < ia.length; i++) {
    output += svg.dot(ia[i])
  }
  return output
}
 
svg.makeLayer = function ({ parent, id, x = 0, y = 0 }) {
    dom[id] = document.createElementNS(svg.nameSpace, "svg");
    dom[id].id = id;
    dom[id].style.transform = "translateX(" + (x * ngn.res) + "px) translateY(" + (y * ngn.res) + "px)";
    parent.appendChild(dom[id]);
};

svg.makeLine = function ({ parent, id, d = "", color = "#ff00ff", stroke = 1, cap = "round", join = "round" }) {
    dom[id] = document.createElementNS(svg.nameSpace, "path");
    dom[id].setAttributeNS(null, "fill", "none");
    dom[id].setAttributeNS(null, "d", d);
    dom[id].setAttributeNS(null, "stroke-width", stroke * ngn.res);
    dom[id].setAttributeNS(null, "stroke", color);
    dom[id].setAttributeNS(null, "stroke-linecap", cap);
    dom[id].setAttributeNS(null, "stroke-linejoin", join);
    dom[id].id = id;
    parent.appendChild(dom[id]);
};

svg.makeShape = function ({ parent, id, d = "", color = "#ff00ff" }) {
    dom[id] = document.createElementNS(svg.nameSpace, "path");
    dom[id].setAttributeNS(null, "fill", color);
    dom[id].setAttributeNS(null, "d", d);
    dom[id].id = id;
    parent.appendChild(dom[id]);
};

svg.bezierPath = function(pts, t, closed) {
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
    // change to quadratic bezier for first and last point. see example.js
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

// DOM

let dom = {}

// adding main stage for all elements to have same coord.-center
dom.stage = document.createElement("stage")
dom.stage.style.transform = "translateX(" + (ngn.center.x * ngn.res) + "px) translateY(" + (ngn.center.y * ngn.res) + "px)"
dom.stage.id = "stage"

document.body.appendChild(dom.stage)

svg.makeLayer({ parent: dom.stage, id: "svgLayer", x: 0, y: 0})

