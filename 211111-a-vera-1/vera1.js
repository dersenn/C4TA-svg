// VERA 1

function vera1(xPos, yPos, w, h, divisions) {
  let cols = divisions
  let rows = cols

  let o = 3 // meaning tiles overlap by a third

  // those have been calculated by some solving of problems in calculations.js.
  let tileW = ( w * o ) / ( -cols + 3 + cols * o ) 
  let tileH = ( h * o ) / ( -rows + 3 + rows * o )

  let xOverlap = tileW / o
  let yOverlap = tileH / o

  xPos += xOverlap
  yPos += yOverlap

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

    ngn.makeSvgLine({ parent: dom.svgLayer, id: "vera1_", stroke: .2, d: ngn.svgPath(positions[getRandomInt(0, positions.length)]), color: colors[getRandomInt(0, colors.length)] })
  }
}