// SOME UTILITY FUNCTIONS

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

function radians(degrees) {
  return degrees * (Math.PI/180);
}

function getDistance(a, b) {
    var aa = a.x - b.x;
    var bb = a.y - b.y;
    return Math.round(Math.sqrt(aa * aa + bb * bb) * 100) / 100;
}

// MAP VALUES (as in p5.js map())
function mapValues(val, minIn, maxIn, minOut, maxOut) {
    // first map value from (minIn..maxIn) to (0..1)
    val = (val - minIn) / (maxIn - minIn)
    // then map it from (0..1) to (minOut..maxOut) and return it
    return minOut + val * (maxOut - minOut)
}

// NEEDS UPDATING, ONCE THE ENGINE IS READY.
function drawCenterGrid() {
  ngn.makeSvgLine({ parent: dom.svgLayer, stroke: .1, d: ngn.svgPath([{x: 0, y: ngn.height/2}, {x: 0, y: -ngn.height/2}]), color: "#0ff" })
  ngn.makeSvgLine({ parent: dom.svgLayer, stroke: .1, d: ngn.svgPath([{x: -ngn.width/2, y: 0}, {x: ngn.width/2, y: 0}]), color: "#0ff" })
}

const rgbToHex = (r, g, b) =>
  "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);