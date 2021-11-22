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

let nCols = 100
let nRows = 10
let step = {x: ngn.width/nCols, y: ngn.height/nRows}
// let position = { x: -ngn.width/2 + step.x/2, y: -ngn.height/2 + step.y/2}
let position = { x: -ngn.width/2 + step.x/2, y: -ngn.height/2 + step.y/2}



let resolution = .05
let speed = .0003


// green

svg.makeLine({
  parent: dom.svgLayer, 
  id: "wave",
  cap: "round", 
  stroke: .3, 
  color: "#000", 
  d: ""
  // d: svg.path(points, false)
});


let loop1 = function loop(time) {

  let lines = []
  for (let y = 0; y < nRows; y++) {
    let points = []
    let yOff = position.y + y * step.y
    for (let x = 0; x < nCols; x++) {
      let ampY = simplex.noise3D(x * resolution, y * resolution, time * speed)
      yOff += (mapValues(ampY, -1, 1, -step.y/2, step.y/2))
      let xOff = position.x + x * step.x
      points.push({x: xOff, y: yOff})
    }
    lines.push(points)
  }

  let col = simplex.noise2D(time/1000, 0)
  col = mapValues(col, -1, 1, 0, 255)

  dom["wave"].setAttributeNS(null, "d", svg.paths(lines));
  dom["wave"].setAttributeNS(null, "stroke", rgbToHex(0,col,0))

  requestAnimationFrame(loop)
}

loop1(0)


// red

svg.makeLine({
  parent: dom.svgLayer, 
  id: "wave2",
  cap: "round", 
  stroke: 1, 
  color: "#000", 
  d: ""
  // d: svg.path(points, false)
});


const loop2 = function loop(time) {

  let lines = []
  for (let y = 0; y < nRows; y++) {
    let points = []
    // let posY = (position.y + y * step.y) + mapValues(simplex.noise2D(y * resolution, 1), -1, 1, -step.y/2, step.y/2)
    let posY = position.y + y * step.y
    let yOff = position.y + y * step.y
    for (let x = 0; x < nCols; x++) {
      let ampY = simplex.noise3D(x * resolution, y * resolution, time * speed)
      yOff = /*posY*/ posY + (mapValues(ampY, -1, 1, -step.y/2, step.y/2))
      let xOff = position.x + x * step.x
      points.push({x: xOff, y: yOff})
    }
    lines.push(points)
  }

  let col = simplex.noise2D(time/500, 0)
  col = mapValues(col, -1, 1, 0, 255)

  dom["wave2"].setAttributeNS(null, "d", svg.paths(lines));
  dom["wave2"].setAttributeNS(null, "stroke", rgbToHex(col,0,0))

  requestAnimationFrame(loop)
}

loop2(0)

