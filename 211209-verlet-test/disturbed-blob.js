// Info
// ngn = dein twrk, findet sich in engine.js, aber eigentlich alles identisch.
// ngn.min ist einfach die kürzere der beiden Seiten (praktisch für quadratisches)


// DRAW

drawCenterGrid()

// test dot
svg.makeLine({
  parent: dom.svgLayer,
  id: "pointA",
  color: "#ff0",
  cap: "round",
  stroke: 3
})


// SETUP

let speed = 2000

// the center
let ct = { position: {x: 0, y: 0} }

// create ptA
// starting at the right edge, from where it moves to verlet position/distance
let ptA = physics.makePoint({ 
    id: "ptA", 
    position: { x: ngn.min/2, y: 0 },
    acceleration: { x: 0, y: 0 },
    drag: .9
  })


// the position where the point wants to be (from center)
// why does the point only go half the way?
let prefDist = 0


// ANIMATE

function draw(t) {

  // bind pointA to center
  physics.verlet({a: ct, b: ptA, distance: prefDist, stiffness: .01, iterations: 10})
  //console.log(ptA.position)

  dom["pointA"].setAttributeNS(null, "d", svg.dot(ptA.position))

  requestAnimationFrame(draw)
}

draw(0)


// INTERACTION

// on click move point to edge, from where it should move back to his desired position.
document.addEventListener("click", function() {
  ct.position.x -= ngn.min/2
  ptA.position.x += ngn.min/2
  console.log(ct.position.x, ptA.position.x)
})


// document.addEventListener('mousemove', e => {
//   ct.position.x = (e.clientX - ngn.min/2)/ngn.res;
//   console.log(ct.position.x,e.clientX)
// })





// My only friend, the End.