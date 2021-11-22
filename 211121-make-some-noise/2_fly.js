// SETUP STUFF


//drehung
lineRotation = function ({ point, long, rotation }) {
    return [
        { x: point.x, y: point.y },
        { x: point.x + Math.sin(rotation) * long, y: point.y + Math.cos(rotation) * long }
    ];
};

let simplex = new SimplexNoise();



// DRAW STUFF


function noise1() {
  svg.makeLine({
    parent: dom.svgLayer,
    id: "dot",
    color: "#0f0",
    cap: "square",
    stroke: 3
  })

  let time = {}
  let speed = 1000
  let amp = 20

  function loop(t) {

    // to get the time difference from loop before. returns steady number (???)
    time.now = t
    time.delta = time.now - time.before
    time.before = time.now


    let x = simplex.noise2D(10, time.now/speed) * amp
    let y = simplex.noise2D(20, time.now/speed) * amp
    let position = {x: x, y: y}

    let path = svg.dot(position)

    dom.dot.setAttributeNS(null, "d", path)

    requestAnimationFrame(loop)
  }

  loop(0)
}

noise1()



