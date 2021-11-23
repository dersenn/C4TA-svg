// FUNCTIONS

mesh = {}

mesh.path = function (ia, close = false) {
    let output = "M ";
    for (var i = 0; i < ia.length; i++) {
        output += ia[i].pos.x * ngn.res + " " + ia[i].pos.y * ngn.res + " ";
    }
    if (close) {
      output += "z";
    }
    return output;
};

mesh.paths = function (ia, close = false) {
  let output = "";
  for (var i = 0; i < ia.length; i++) {
      output += mesh.path(ia[i], close);
  }
  return output;
};

mesh.dot = function(io) {
  let output = "M " + io.pos.x * ngn.res + " " + io.pos.y * ngn.res + " z"
  return output
}

mesh.dots = function(ia) {
  let output = ""
  for(i = 0; i < ia.length; i++) {
    output += mesh.dot(ia[i])
  }
  return output
}

mesh.connections = function(ia) {
  let output
}

// SETUP
let simplex = new SimplexNoise();

let nCols = 10
let nRows = nCols

let cell = {
  w: ngn.width / nCols,
  h: ngn.height / nRows
}

// MAKE MESH WITH NOISE

// create initial points on grid
let points = []
for (let x = 0; x < nCols; x++) {
  let cols = []
  for (let y = 0; y < nRows; y++) {
    let xOff = (-ngn.width/2 + x * cell.w) + cell.w / 2
    let yOff = (-ngn.height/2 + y * cell.h) + cell.h / 2
    let pos = {x: xOff, y: yOff}
    let i = {x: x, y: y}
    cols.push({i, pos})
  }
  points.push(cols)
}

// assign connections to each point
let connections = []
for (let x = 0; x < nCols - 1; x++) {
  for (let y = 0; y < nRows - 1; y++) {
    let pa = points[x][y]
    let pb = points[x][y + 1]
    let pc = points[x + 1][y + 1]
    let pd = points[x + 1][y]
    connections.push([pa, pb, pc, pd])
  }
}
// console.log(connections)


svg.makeLine({
  parent: dom.svgLayer,
  id: "cells",
  color: "#0f0",
  cap: "round",
  stroke: .3
})


// ANIMATE
let res = 0.01
let speed = 1000


let newPoints = connections

function loop(t) {

  for (let i = 0; i < connections.length; i++) {
    let perlinX = simplex.noise2D(t / speed, i)
    let perlinY = simplex.noise2D(i, t / speed)
    for (let j = 0; j < connections[i].length; j++) {
      op = connections[i][j]
      np = newPoints[i][j]

      np.pos.x = op.pos.x + mapValues(perlinX * res, -1, 1, -cell.w/2, cell.w/2)
      np.pos.y = op.pos.y + mapValues(perlinY * res, -1, 1, -cell.w/2, cell.w/2)

      // p.pos.x += perlinX * cell.w/1000
      // p.pos.y += perlinY * cell.w/1000
    }
  }

  let path = mesh.paths(newPoints, true)

  dom.cells.setAttributeNS(null, "d", path)

  requestAnimationFrame(loop)
}

loop(0)