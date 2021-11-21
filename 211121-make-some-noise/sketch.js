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

let nCols = 500
let nRows = 3
let step = {x: ngn.width/nCols, y: ngn.height/nRows}
// let position = { x: -ngn.width/2 + step.x/2, y: -ngn.height/2 + step.y/2}
let position = { x: -ngn.width/2 + step.x/2, y: -ngn.height/2 + step.x/2}


for (let lines = 0; lines < nRows; lines++) {
  svg.makeLine({
    parent: dom.svgLayer, 
    id: "wave" + lines,
    cap: "round", 
    stroke: 1, 
    color: "#000", 
    d: ""
    // d: svg.path(points, false)
  });
}



let resolution = .1
let amp = .0003
let speed = .0001

function loop(time) {
  let points = []

  for (let y = 0; y < nRows; y++) {
    let yOff = position.y + y * step.y
    for (let x = 0; x < nCols; x++) {
      yOff = yOff + (simplex.noise3D(step.y/10, x * resolution / 10, time * speed) * step.y / 100)
      points.push({x: position.x + x * step.x, y: yOff})
    }
  }
  // console.log(points)

  for (let y = 0; y < nRows; y++) {
    dom["wave" + y].setAttributeNS(null, "d", svg.path(points, false));
  }

  requestAnimationFrame(loop)
}

loop(0)
