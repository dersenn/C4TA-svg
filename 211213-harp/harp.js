// DRAW

// the blob
svg.makeShape({
  parent: dom.svgLayer,
  id: "blob",
  color: "#0f0",
  cap: "round",
  stroke: .2
})

// the red dots
// svg.makeLine({
//   parent: dom.svgLayer,
//   id: "reddots",
//   color: "#f00",
//   cap: "round",
//   stroke: 1
// })

// the blue dots
svg.makeLine({
  parent: dom.svgLayer,
  id: "bluedots",
  color: "#00f",
  cap: "round",
  stroke: 4
})

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


// AUDIO / SOUND

let audioCtx = new(window.AudioContext || window.webkitAudioContext)()


let constantNode = audioCtx.createConstantSource()
let gainNode1 = audioCtx.createGain()
let delayNode = audioCtx.createDelay(2)

delayNode.connect(gainNode1)

let osc1 = audioCtx.createOscillator()
osc1.type = "sine"
osc1.frequency.value = 391.995435981749294


constantNode.connect(gainNode1.gain)
gainNode1.connect(audioCtx.destination)
osc1.connect(gainNode1)
osc1.connect(delayNode)


// click event to start audio.
let audioOn = false
document.addEventListener("click", function() {
  if (!audioOn) {
    constantNode.start();
    osc1.start()
    audioOn = true
  }
})


// SETUP
let simplex = new SimplexNoise()

// previous blob stuff
let noiseMax = .5 // what's this for again???
let res = 1
let speed = 2000

let maxLength = ngn.min/4
let minLength = maxLength/3


// the center
let ct = { position: {x: 0, y: 0} }

// tests
let ptA = physics.makePoint({ 
    id: "ptA", 
    position: { x: ngn.min/2, y: 0 },
    acceleration: { x: 0, y: 0 },
    drag: .9
  })


// let scales = {}
// scales.dmin = [18.35, 20.60, 21.83, 27.50, 29.14, 32.70] // D, E, F, G, A, Bb, C

let nPts = 2
let aStep = -Math.PI*2 / nPts

// the position where the point wants to be (from center)
let prefDist = ngn.min/4


// the points/notes. connect to center via verlet later.
let pts = [];
for (let i = 0; i < nPts; i++) {
  let a = i * aStep
  let r = ngn.min/4
  pts.push(physics.makePoint({ 
    id: "pt" + i, 
    position: { x: Math.cos(a) * r *2, y: Math.sin(a) * r *2},
    acceleration: { x: 0, y: 0 },
    drag: 0.9
  }))
  pts[i].r = r
  pts[i].a = a
}

console.log(pts)


// ANIMATE

function draw(t) {

  // SOUND MODULATION
  let noise = simplex.noise2D(10,t/1000)
  let mod = mapValues(noise, -1, 1, -10, 10)

  osc1.frequency.value = mod

  let pulse = Math.sin(t/100)
  gainNode1.gain.setValueAtTime(mapValues(pulse, -1, 1, 2, 3), audioCtx.currentTime)


  // bind pointA to center
  physics.verlet({a: ct, b: ptA, distance: prefDist, stiffness: .01, iterations: 10})

  let points = []
  for (let p = 0; p < pts.length; p++) {
    let pt = pts[p]
    physics.verlet({a: ct, b: pt, distance: prefDist, stiffness: .01, iterations: 1})

    let xOff = mapValues(Math.cos(pt.a), -1, 1, 0, noiseMax)
    let yOff = mapValues(Math.sin(pt.a), -1, 1, 0, noiseMax)

    // let wobble = simplex.noise3D(xOff * res, yOff * res, t/speed)
    // pt.r = mapValues(wobble, -1, 1, minLength, maxLength)

    pt.position = {x: Math.cos(pt.a) * pt.r, y: Math.sin(pt.a) * pt.r}


    points.push(pt.position)
  }

  dom["blob"].setAttributeNS(null, "d", svg.bezierPath(points, .4, true))
  dom["bluedots"].setAttributeNS(null, "d", svg.dots(points))
  dom["pointA"].setAttributeNS(null, "d", svg.dot(ptA.position))

  requestAnimationFrame(draw)
}

draw(0)


// INTERACTION

document.addEventListener("click", function() {
  ct.position.x -= ngn.min/4
  ptA.position.x += ngn.min/4
  for (let i = 0; i < pts.length; i++) {
    let pt = pts[i]
    console.log("before: " + pt.position.x)
    pt.position.x += ngn.min/4
    // pt.position = {x: Math.cos(pt.a) * pt.r * 2, y: Math.sin(pt.a) * pt.r * 2}
    console.log(pt.position.x)
  }
})




// My only friend, the End.