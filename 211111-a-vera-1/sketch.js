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



// VERA 1

// needs work on the "border". should stay the same... no matter how many divisions.

function vera1(xPos, yPos, w, h, divs) {
  let cols = divs
  let rows = cols

  let overlap = 3 // meaning a third

  let tileW = w / cols
  let tileH = h / rows

  let xOverlap = tileW / overlap
  let yOverlap = tileH / overlap

  xPos += (cols - 1) * (xOverlap/2)
  yPos += (rows - 1) * (yOverlap/2)

  for (let x = 0; x < cols; x++) {
    let xOff = xPos + x * (tileW - xOverlap)
    for (let y = 0; y < rows; y++) {
      let yOff = yPos + y * (tileH - yOverlap)

      drawVeraElement(xOff, yOff, tileW, tileH)
    }
  }

  function drawVeraElement(xPos, yPos, w, h) {
    let positions = [
      [{x: xPos, y: yPos},{x: xPos + w, y: yPos + h}],
      [{x: xPos, y: yPos + h},{x: xPos + w, y: yPos}],
      [{x: xPos + w/2, y: yPos},{x: xPos + w/2, y: yPos + h}],
      [{x: xPos, y: yPos + h/2},{x: xPos + w, y: yPos + h/2}]
     ]

    ngn.makeSvgLine({ parent: dom.svgLayer, id: "vera1_", stroke: .5, d: ngn.svgPath(positions[getRandomInt(0, positions.length)]), color: colors[getRandomInt(0, colors.length)] })
  }
}

// DRAW

// drawCenterGrid()

vera1(-ngn.min/2, -ngn.min/2, ngn.min, ngn.min, 12)

