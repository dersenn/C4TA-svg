// SETUP STUFF


//drehung
lineRotation = function ({ point, long, rotation }) {
    return [
        { x: point.x, y: point.y },
        { x: point.x + Math.sin(rotation) * long, y: point.y + Math.cos(rotation) * long }
    ];
};

let simplex = new SimplexNoise();


// SETUP

let nArms = 50
let maxLength = ngn.width/2
let minLength = maxLength/2

let aStep = 2 * Math.PI/nArms

// DRAW STUFF

svg.makeLine({
  parent: dom.svgLayer,
  id: "flower",
  color: "#0f0",
  cap: "round",
  stroke: .3
})

let res = .0005
let a = 0

function loop(t) {

  let aInc = -t / 1000 / (Math.PI * 2)

  let arms = []
  let radius = maxLength

  for (let i = 0; i < nArms; i++) {
    let perlin = simplex.noise2D (t * res, i)

    radius = mapValues(perlin, -1, 1, minLength, maxLength)

    a = aInc + i * aStep

    let ptA = {x: 0, y: 0}
    let ptB = {x: Math.cos(a) * radius, y: Math.sin(a) * radius}

    arms.push([ptA, ptB])
  }

  let path = svg.paths(arms)

  dom.flower.setAttributeNS(null, "d", path)

  requestAnimationFrame(loop)
}

loop(0)