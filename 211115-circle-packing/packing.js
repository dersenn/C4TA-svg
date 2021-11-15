// CIRCLE PACKING

ngn.packing(xPos, yPos, r, maxCircles) {
  let circles = {}
  this.max = maxCircles

  this.getDistance = function(a, b) {
    let aa = a.x - b.x
    let bb = a.y - b.y
    return Math.sqrt(aa**2 + bb**2)
  }

  this.noCollision = function() {


  }

  this.createCircles = function() {
    let c
    while(c < this.max) {

      c++
    }

  }

  this.drawCircle = function() {

    ngn.makeSvgLine({ parent: dom.svgLayer, id: "circle", stroke: r * 2, d: ngn.svgPath(circles), color: colors[2] })

  }
}