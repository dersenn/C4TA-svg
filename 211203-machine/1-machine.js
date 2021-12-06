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

//svg layer
svg.makeLayer({ 
  parent: dom.stage, 
  id: "svgLayer", 
  x: 0, 
  y: 0 
});

svg.makeLine({ 
  parent: dom.svgLayer, 
  id: "rope", 
  join: "bevel", 
  cap: "round", 
  stroke: 0.5, 
  color: "#fff"
});

svg.makeLine({
  parent: dom.svgLayer,
  id: "ball",
  color: "#f00",
  cap: "round",
  stroke: 10
})

//make rope
let nDots = 3
let dotDist = ngn.height / nDots
let forceY = 0

let dots = [];
for (let i = 0; i < nDots; i++) {
  if (i == nDots) {
    forceY = 100
  }
  dots.push(physics.makePoint({ 
    id: "dot" + i, 
    position: { x: 0, y: -ngn.height/2 + i*dotDist },
    acceleration: { x: 0, y: forceY }
  }));
  // ADD FORCE TO LAST POINT!!!
}

//LOOP

function loop(time) {

    let speed = 500;
    let collect = []

    // console.log(dots[dots.length-1])
    dots[dots.length-1].position.x = 0 + Math.sin(time/speed) * ngn.width/4

    // verlet
    // physics.verlet({a: dots[0], b: dots[1], distance: dotDist, stiffness: .1, iterations: 1})
    for (let i = 1; i < dots.length; i++) {
      physics.verlet({a: dots[i-1], b: dots[i], distance: dotDist, stiffness: .1, iterations: 1})
    }

    for (let i = 0; i < dots.length; i++) {
      collect.push(dots[i].position)
    }

    dom.rope.setAttributeNS(null, "d", svg.pathSoft(collect));
    dom.ball.setAttributeNS(null, "d", svg.dot(collect[collect.length-1]));

    requestAnimationFrame(loop);
};

loop(0);
