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

physics.verlet = function ({ a, b, distance, stiffness }) {

    let difference = { x: a.position.x - b.position.x, y: a.position.y - b.position.y };
    let dot = (difference.x * difference.x) + (difference.y * difference.y);

    if (dot == 0) dot = 0.001;

    let scalar = (distance - dot) / dot * stiffness * 0.5;
    let move = { x: difference.x * scalar, y: difference.y * scalar };

    a.position = { x: a.position.x + move.x, y: a.position.y + move.y };
    b.position = { x: b.position.x - move.x, y: b.position.y - move.y };
};



// SETUP

let simplex = new SimplexNoise();

//make physics dots
let nDots = 10

let dots = [];
for (let i = 0; i < nDots; i++) {
    dots.push(physics.makePoint({ 
        id: "dot" + i, 
        position: { x: -50 + Math.random() * ngn.min/2, y: Math.random() * ngn.min }
    }));
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
  id: "rope", 
  join: "bevel", 
  cap: "round", 
  stroke: 0.5, 
  color: "#fff"
});

svg.makeLine({ 
  parent: dom.svgLayer, 
  id: "circles", 
  stroke: 4, 
  color: "#ff0", 
  cap: "round" 
});

// my stuff
svg.makeLine({
  parent: dom.svgLayer,
  id: "points",
  color: "#f00",
  cap: "round",
  stroke: 2
})


//LOOP

function loop(time) {

    //circles

    let speed = 500;
    let size = 10;

    let noiseX = size * simplex.noise2D(1, size / time)
    let noiseY = size * simplex.noise2D(size / time, 1)

// replace noise.. with size, to take it back

    let circleLeft = { position: { x: Math.sin(Math.PI) * noiseY, y: Math.cos(time / speed) * noiseX*4 } };
    let circleRight = { position: { x: Math.cos(time / speed) * noiseX, y: Math.sin(time / speed) * noiseY*4 } };
    dom.circles.setAttributeNS(null, "d", svg.paths([[circleLeft.position], [circleRight.position]]));

    //verlet
    physics.verlet({ a: circleLeft, b: dots[0], distance: 0, stiffness: .5 });
    for (let i = 0; i < dots.length-1; i++) {
        physics.verlet({ a: dots[i], b: dots[(i+1)], distance: 1, stiffness: 0.8 });
    }
    physics.verlet({ a: dots[dots.length-1], b: circleRight, distance: 0, stiffness: 1 });

    let collect = [];
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];
        physics.calculate({ point: dot, force: { x: 0, y: 0 } });
        collect.push(dot.position)
    }
    dom.rope.setAttributeNS(null, "d", svg.path(collect));
    dom.points.setAttributeNS(null, "d", svg.dots(collect));


    requestAnimationFrame(loop);
};

loop(0);
