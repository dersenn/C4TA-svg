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
  stroke: 20
})

//make rope
let nDots = 5
let dotDist = 5//ngn.height / nDots

let dots = [];
for (let i = 0; i < nDots; i++) {
  dots.push(physics.makePoint({ 
    id: "dot" + i, 
    position: { x: 0, y: -ngn.height/2 + i*dotDist },
    acceleration: { x: 0, y: 0 },
    drag: 0.9
  }));
}

//LOOP

function loop(time) {

    let speed = 500;
    let collect = []

    // dots[dots.length-1].position.x = 0 + Math.sin(time/speed) * ngn.width/4


    // verlet
    for (let i = 1; i < dots.length; i++) {
      physics.verlet({a: dots[i-1], b: dots[i], distance: dotDist, stiffness: .1, iterations: 100})
    }

    for (let i = 0; i < dots.length; i++) {
      if (i == dots.length-1) {
        physics.calculate({ point: dots[i], force: { x: 0, y: .9 } })
      }
      collect.push(dots[i].position)
    }
    dots[0].position = {x: 0, y: -ngn.height/2} 

    dom.rope.setAttributeNS(null, "d", svg.pathSoft(collect));
    dom.ball.setAttributeNS(null, "d", svg.dot(collect[collect.length-1]));

    requestAnimationFrame(loop);
};

loop(0);


// trying to make ball draggable, adapting from here:
// https://javascript.info/mouse-drag-and-drop
dom.ball.onmousedown = function(event) {
  console.log("ball mousedown")

  function moveBall(pageX, pageY) {
    dots[dots.length-1].position.x = mapValues(pageX, 0, window.innerWidth, -ngn.width/2, ngn.width/2)
    dots[dots.length-1].position.y = mapValues(pageY, 0, window.innerHeight, -ngn.height/2, ngn.height/2)
  }
  moveBall(event.pageX, event.pageY)

  function onMouseMove(event) {
    moveBall(event.pageX, event.pageY)
  }
  document.addEventListener('mousemove', onMouseMove)
  document.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove)
    document.onmouseup = null
  }

}





// my only friend, the end.