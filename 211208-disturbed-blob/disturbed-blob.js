// DRAW

// the blob
// svg.makeShape({
//   parent: dom.svgLayer,
//   id: "blob",
//   color: "#0f0",
//   cap: "round",
//   stroke: .2
// })

// the red dots
// svg.makeLine({
//   parent: dom.svgLayer,
//   id: "reddots",
//   color: "#f00",
//   cap: "round",
//   stroke: 1
// })

// the blue dots
// svg.makeLine({
//   parent: dom.svgLayer,
//   id: "bluedots",
//   color: "#00f",
//   cap: "round",
//   stroke: 1
// })

drawCenterGrid()

// test draw
svg.makeLine({
  parent: dom.svgLayer,
  id: "pointA",
  color: "#ff0",
  cap: "round",
  stroke: 3
})


// ADDITIONAL FUNCTIONS

function posToArray(ia) {
  let output = []
  for (let i = 0; i < ia.length; i++) {
    output.push(ia[i].position)
  }
  return output
}


// SETUP
// let simplex = new SimplexNoise()

// previous blob stuff
// let noiseMax = 4 // what's this for again???
// let res = 1
// let speed = 2000

// let maxLength = ngn.min/2
// let minLength = maxLength/3


// the center
let ct = { position: {x: 0, y: 0} }

// tests
let ptA = physics.makePoint({ 
    id: "ptA", 
    position: { x: ngn.min/2, y: 0 },
    acceleration: { x: 0, y: 0 },
    drag: .9
  })


let nPts = 4
// let aStep = -Math.PI*2 / nPts

// the position where the point wants to be (from center)
let prefDist = 0


// the verlet connected points. connect to the center.
// let pts = [];
// for (let i = 0; i < nPts; i++) {
//   pts.push(physics.makePoint({ 
//     id: "pt" + i, 
//     position: { x: 0, y: -ngn.height/2 + i * 20 },
//     acceleration: { x: 0, y: 0 },
//     drag: 0.9
//   }));
// }

// console.log(pts)


// ANIMATE

function draw(t) {

  // bind pointA to center
  physics.verlet({a: ct, b: ptA, distance: prefDist, stiffness: .01, iterations: 10})

  // make pointA move (how to make it not move off limits? stay within preferred distance?)
  physics.calculate({ point: ptA, force: { x: -.01, y: 0 } })


  //////////// the previous blob start //
  // let points = []
  // for (let p = 0; p < nPts; p++) {
  //   let a = p * aStep

  //   let xOff = mapValues(Math.cos(a), -1, 1, 0, noiseMax)
  //   let yOff = mapValues(Math.sin(a), -1, 1, 0, noiseMax)
    
  //   let wobble = simplex.noise3D(xOff * res, yOff * res, t/speed)
  //   let radius = mapValues(wobble, -1, 1, minLength, maxLength)

  //   let pt = {x: Math.cos(a) * radius, y: Math.sin(a) * radius}

  //   points.push(pt)
  // }
  // dom["reddots"].setAttributeNS(null, "d", svg.dots(points))
  // dom["blob"].setAttributeNS(null, "d", svg.bezierPath(points, .4, true))
  //////////// the previous blob end //


  // dom["bluedots"].setAttributeNS(null, "d", svg.dots(posToArray(pts)))
  dom["pointA"].setAttributeNS(null, "d", svg.dot(ptA.position))


  requestAnimationFrame(draw)

}

draw(0)


// INTERACTION

document.addEventListener("click", function() {
  ptA.position.x = ngn.min/2
})

// My only friend, the End.