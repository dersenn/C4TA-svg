// ENGINE

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
  console.log(ngn)
}

ngn.scale({ height: 100})
// possibly use window dimensions?
// and some kind of mapping...

// SVG

ngn.svgNameSpace = "http://www.w3.org/2000/svg"

ngn.svgPath = function (arr) {
  let output = "M "
  for (let i = 0; i < arr.length; i++) {
    output += arr[i].x * ngn.res + " " + arr[i].y * ngn.res + " "
  }
  output += "Z"
  return output
}

ngn.makeSvgLayer = function ({ parent, id, x = 0, y = 0}) {
  dom[id] = document.createElementNS(ngn.svgNameSpace, "svg")
  dom[id].id = id
  dom[id].style.transform = "translateX(" + (x * ngn.res) + "px) translateY(" + (y * ngn.res) + "px)"
  parent.appendChild(dom[id])
}

ngn.makeSvgLine = function ({ parent, id, d = "", color = "#00ff00", stroke = 1, cap = "butt"}) {
  dom[id] = document.createElementNS(ngn.svgNameSpace, "path")
  dom[id].id = id
  dom[id].setAttributeNS(null, "fill", "none")
  dom[id].setAttributeNS(null, "d", d)
  dom[id].setAttributeNS(null, "stroke-width", stroke * ngn.res)
  dom[id].setAttributeNS(null, "stroke", color)
  dom[id].setAttributeNS(null, "stroke-linecap", cap)
  parent.appendChild(dom[id])
}

ngn.makeSvgShape = function ({ parent, id, d = "", color = "#00ff00" }) {
  dom[id] = document.createElementNS(ngn.svgNameSpace, "path")
  dom[id].id = id
  dom[id].setAttributeNS(null, "fill", color)
  dom[id].setAttributeNS(null, "d", d)
  parent.appendChild(dom[id])
}


// DOM

let dom = {}

// adding main stage for all elements to have same coord.-center
dom.stage = document.createElement("stage")
dom.stage.style.transform = "translateX(" + (ngn.center.x * ngn.res) + "px) translateY(" + (ngn.center.y * ngn.res) + "px)"
dom.stage.id = "stage"

document.body.appendChild(dom.stage)

ngn.makeSvgLayer({ parent: dom.stage, id: "svgLayer", x: 0, y: 0})

