// DRAW

let stroke = .8

// the static
svg.makeLine({
  parent: dom.svgLayer,
  id: "static",
  color: "#000",
  cap: "round",
  stroke: stroke
})

// the harp
svg.makeLine({
  parent: dom.svgLayer,
  id: "harp",
  color: "#000",
  cap: "round",
  stroke: stroke
})

// the dots
svg.makeLine({
  parent: dom.svgLayer,
  id: "dots",
  color: "#f00",
  cap: "round",
  stroke: 1
})


// AUDIO / SOUND

// let audioCtx = new(window.AudioContext || window.webkitAudioContext)()




// SETUP

let amp = {
  max: ngn.width/2,
  min: 0,
  val: ngn.width/20,
  yMax: ngn.height/5,
  y: 20
}

let simplex = new SimplexNoise()

let speed = 2000

let nStrings = 40
let strings = []

for (let i = 0; i < nStrings; i++) {
  let pts = {
    ptA: { x: mapValues(i, 0, nStrings, -amp.max, amp.max), y: -ngn.height/2 },
    ptB: { x: mapValues(i, 0, nStrings, -amp.val, amp.val), y: 0 },
    ptC: { x: mapValues(i, 0, nStrings, -amp.max, amp.max), y: ngn.height/2 }
  }
  strings.push(pts)
}


// ANIMATE

function draw(t) {

  let modX = simplex.noise2D(10, t/speed) // Math.sin(t/speed)
  amp.val = mapValues(modX, -1, 1, amp.min, amp.max)

  let modY = simplex.noise2D(t/speed, 100)
  amp.y = mapValues(modY, -1, 1, -amp.yMax, amp.yMax)

  let static = []
  let path = []
  let dots = []
  for (let i = 0; i < strings.length; i++) {
    strings[i].ptB.x = mapValues(i, 0, nStrings, -amp.val, amp.val)
    strings[i].ptB.y = mapValues(i, 0, nStrings, -amp.y, amp.y)

    path.push([strings[i].ptA, strings[i].ptB, strings[i].ptC])
    static.push([strings[i].ptA, strings[i].ptC])
    dots.push(strings[i].ptB)
  }

  dom["static"].setAttributeNS(null, "d", svg.pathsSoft(static))
  dom["harp"].setAttributeNS(null, "d", svg.pathsSoft(path))
  // dom["dots"].setAttributeNS(null, "d", svg.dots(dots))

  requestAnimationFrame(draw)
}

draw(0)


// INTERACTION

// click event to start audio.
let audioOn = false
document.addEventListener("click", function() {
  if (!audioOn) {
    constantNode.start();
    osc1.start()
    audioOn = true
  }
})





// My only friend, the End.