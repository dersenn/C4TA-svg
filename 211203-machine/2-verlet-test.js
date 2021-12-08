// SVG ADDONS

svg.pathSoft = function (ia) {
    ia.unshift(ia[0]);
    let output = "M ";
    for (let i = 1; i < ia.length; i++) {
        output += (ia[i - 1].x + ia[i].x) / 2 * ngn.res + "," + (ia[i - 1].y + ia[i].y) / 2 * ngn.res + " Q";
        output += ia[i].x * ngn.res + "," + ia[i].y * ngn.res + " ";
    }
    output += ia[ia.length - 1].x * ngn.res + "," + ia[ia.length - 1].y * ngn.res + " ";
    return output;
};

svg.pathsSoft = function (ia) {
    let output = "";
    for (var i = 0; i < ia.length; i++) {
        output += svg.pathSoft(ia[i]);
    }
    return output;
};

//PHYSICS

let physics = {};

physics.makePoint = function ({ position = { x: 0, y: 0 }, drag = 0.97, acceleration = { x: 0, y: 0 }, id }) {
  output = {};
  output.id = id;
  output.position = position;
  output.drag = drag;
  output.acceleration = acceleration;
  return output;
};

physics.calculate = function ({ point, force = { x: 0, y: 0 } }) {
  point.acceleration = { x: point.acceleration.x * point.drag, y: point.acceleration.y * point.drag };
  point.acceleration = { x: point.acceleration.x + force.x, y: point.acceleration.y + force.y };
  point.position = { x: point.position.x + point.acceleration.x, y: point.position.y + point.acceleration.y };
};

physics.verlet = function ({ a, b, distance, stiffness, iterations }) {
  for (let i = 0; i < iterations; i++) {
    let difference = { x: a.position.x - b.position.x, y: a.position.y - b.position.y };
    let dot = Math.sqrt(difference.x**2 + difference.y**2);

    if (dot == 0) dot = 0.001;

    let scalar = (distance - dot) / dot * stiffness * 0.5;
    let move = { x: difference.x * scalar, y: difference.y * scalar };

    a.position = { x: a.position.x + move.x, y: a.position.y + move.y };
    b.position = { x: b.position.x - move.x, y: b.position.y - move.y };
  }
};

// SETUP

let nPts = 20
let points = []

for (let i = 0; i < nPts; i++) {
  points.push(physics.makePoint({position: {x: getRandomInt(-50,50), y: getRandomInt(-50,50)}} ))
}


//svg layer
svg.makeLayer({ 
  parent: dom.stage, 
  id: "svgLayer", 
  x: 0, 
  y: 0 
});

svg.makeLine({ 
  parent: dom.svgLayer, 
  id: "dots", 
  join: "bevel", 
  cap: "round", 
  stroke: 1, 
  color: "#fff"
});

svg.makeLine({
  parent: dom.svgLayer,
  id: "ball",
  color: "#0f0",
  cap: "round",
  stroke: 20
})


//LOOP

function loop(time) {

  let path = []
  for (let i = 0; i < points.length; i++) {
    path.push(points[i].position)
  }

  dom.dots.setAttributeNS(null, "d", svg.pathSoft(path));

  // Haha. Ain't no Verlet in here. Tricked ya.

};

loop(0);







// my only friend, the end.