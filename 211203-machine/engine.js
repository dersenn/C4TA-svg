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


// DOM

let dom = {}

// adding main stage for all elements to have same coord.-center
dom.stage = document.createElement("stage")
dom.stage.style.transform = "translateX(" + (ngn.center.x * ngn.res) + "px) translateY(" + (ngn.center.y * ngn.res) + "px)"
dom.stage.id = "stage"

document.body.appendChild(dom.stage)

svg.makeLayer({ parent: dom.stage, id: "svgLayer", x: 0, y: 0})

