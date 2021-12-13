// DRAW

let stroke = .3

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

let audioCtx = new(window.AudioContext || window.webkitAudioContext)()


let constantNode = audioCtx.createConstantSource()
let gainNode1 = audioCtx.createGain()
let delayNode = audioCtx.createDelay(2)

delayNode.connect(gainNode1)

let osc1 = audioCtx.createOscillator()
osc1.type = "sine"
osc1.frequency.value = 36.71


constantNode.connect(gainNode1.gain)
gainNode1.connect(audioCtx.destination)
osc1.connect(gainNode1)
osc1.connect(delayNode)


// SETUP

let amp = {
  max: ngn.width/2,
  min: 0,
  val: ngn.width/20,
  yMax: ngn.height/5,
  y: 20
}

let simplex = new SimplexNoise()

let speed = 2500

let nStrings = 30
let strings = []

let offset = ngn.width/nStrings / 2


for (let i = 0; i < nStrings; i++) {
  let pts = {
    ptA: { x: offset + mapValues(i, 0, nStrings, -amp.max, amp.max), y: -ngn.height/2 },
    ptB: { x: offset + mapValues(i, 0, nStrings, -amp.val, amp.val), y: 0 },
    ptC: { x: offset + mapValues(i, 0, nStrings, -amp.max, amp.max), y: ngn.height/2 }
  }
  strings.push(pts)
}


// ANIMATE

function draw(t) {

  // NOISE
  let modX = simplex.noise2D(10, t/speed)
  let modY = simplex.noise2D(t/speed, 100)

  // SOUND MODULATION
  let mod = mapValues(modX, -1, 1, 50, 20)
  osc1.frequency.value = mod

  let pulse = Math.sin(modY/1000)
  // gainNode1.gain.setValueAtTime(pulse, audioCtx.currentTime)


  // SHAPES
  amp.val = mapValues(modX, -1, 1, amp.min, amp.max)
  amp.y = mapValues(modY, -1, 1, -amp.yMax, amp.yMax)

  let static = []
  let path = []
  let dots = []
  for (let i = 0; i < strings.length; i++) {
    strings[i].ptB.x = offset + mapValues(i, 0, nStrings, -amp.val, amp.val)
    strings[i].ptB.y = mapValues(i, 0, nStrings, -amp.y, amp.y)

    path.push([strings[i].ptA, strings[i].ptB, strings[i].ptC])
    static.push([strings[i].ptA, strings[i].ptC])
    dots.push(strings[i].ptB)
  }

  // dom["static"].setAttributeNS(null, "d", svg.pathsSoft(static))
  dom["harp"].setAttributeNS(null, "d", svg.pathsSoft(path))
  // dom["dots"].setAttributeNS(null, "d", svg.dots(dots))

  requestAnimationFrame(draw)
}



// INTERACTION

const start = document.getElementById("start")

// click event to start audio.
let play = false
start.addEventListener("click", function() {
  if (!play) {
    constantNode.start();
    osc1.start()
    play = true
    start.classList.toggle("clicked")
    draw(0)
  }
})





// My only friend, the End.