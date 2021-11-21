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
let nRows = 4
let step = {x: ngn.width/nCols, y: ngn.height/nRows}
// let position = { x: -ngn.width/2 + step.x/2, y: -ngn.height/2 + step.y/2}
let position = { x: -ngn.width/2 + step.x/2, y: 0}


svg.makeLine({
  parent: dom.svgLayer, 
  id: "wave",
  cap: "round", 
  stroke: 1, 
  color: "#000", 
  d: ""
  // d: svg.path(points, false)
});


let resolution = .1
let amp = .0003
let speed = .0005


function loop(time) {
  let points = []

  for (let x = 0; x < nCols; x++) {
    let yOff = simplex.noise3D(step.y, x * resolution / 10, time * speed) * ngn.height/nRows
    points.push({x: position.x + x * step.x, y: yOff})
  }

  dom["wave"].setAttributeNS(null, "d", svg.path(points));

  requestAnimationFrame(loop)
}

loop(0)

    //drawing

    // let step = 4;
    // let position = { x: -50, y: -50 };
    // let resolution = 0.01;
    // let speed = 0.0001;

    // svg.makeLine({ parent: dom.svgLayer, id: "lines", cap: "round", stroke: 3, color: "#fff", d: "" });

    // function loop(time) {

    //     let collect = []; //[[{x: 10, y: 10}, {x: 20, y: 20}], [{x: 10, y: 10}, {x: 20, y: 20}], [{x: 10, y: 10}, {x: 20, y: 20}]];

    //     for (let y = 0; y < 25; y++) {
    //         for (let x = 0; x < 25; x++) {

    //             let radian = simplex.noise3D(x * resolution, y * resolution, time * speed) * Math.PI;
    //             let distance = (1 + simplex.noise3D(y * resolution, x * resolution, time * speed)) * 2;

    //             collect.push(lineRotation({
    //                 point: { x: position.x + x * step, y: position.y + y * step },
    //                 rotation: radian,
    //                 long: distance
    //             }));
    //         }
    //     }

    //     dom["lines"].setAttributeNS(null, "d", svg.paths(collect));

    //     requestAnimationFrame(loop);

    // };

    // loop(0);
