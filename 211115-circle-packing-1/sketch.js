// DO STUFF

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

function coinToss(chance) {
  if (Math.random() < chance / 100) {
    return true
  }
}

function drawCenterGrid() {
  ngn.makeSvgLine({ parent: dom.svgLayer, stroke: .1, d: ngn.svgPath([{x: 0, y: ngn.height/2}, {x: 0, y: -ngn.height/2}]), color: "#0ff" })
  ngn.makeSvgLine({ parent: dom.svgLayer, stroke: .1, d: ngn.svgPath([{x: -ngn.width/2, y: 0}, {x: ngn.width/2, y: 0}]), color: "#0ff" })
}

let colors = ["#ff0000", "#00ff00", "#0000ff"]


// DRAW STUFF

packing(-ngn.min/2, -ngn.min/2, ngn.min, ngn.min, 1)

