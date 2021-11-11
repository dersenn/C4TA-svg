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

let colors = ["#ff0000", "#00ff00", "#0000ff"]



// VERA 1

function vera1(xPos, yPos, w, h) {
  let cols = 3
  let rows = cols

  let tileW = w / cols
  let tileH = h / rows

  let xOverlap = tileW / 3
  let yOverlap = tileH / 3

  xPos += ((rows - 1) * xOverlap) /2
  yPos += ((cols - 1) * yOverlap) /2

  for (let x = 0; x < cols; x++) {
    let xOff = xPos + x * tileW - xOverlap
    for (let y = 0; y < rows; y++) {
      let yOff = yPos + y * tileH - yOverlap

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

ngn.makeSvgLine({ parent: dom.svgLayer, stroke: .1, d: ngn.svgPath([{x: 0, y: ngn.height/2}, {x: 0, y: -ngn.height/2}]), color: "#0ff" })

vera1(-ngn.width/2, -ngn.height/2, ngn.width, ngn.height)

