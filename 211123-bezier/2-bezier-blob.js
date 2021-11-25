// FUNCTIONS

svg.lineSoft = function (ia) {

    //clone first and last point
    ia.unshift(ia[0]);
    ia.push(ia[ia.length - 1]);

    let output = "M ";
    for (let i = 1; i < ia.length; i++) {
        output += (ia[i - 1].x + ia[i].x) / 2 * ngn.res + "," + (ia[i - 1].y + ia[i].y) / 2 * ngn.res + " Q";
        output += ia[i].x * ngn.res + "," +ia[i].y * ngn.res + " ";
    }

    //end point
    output += ia[ia.length - 1].x * ngn.res + "," + ia[ia.length - 1].y * ngn.res + " ";
    return output;
};


// SETUP
let simplex = new SimplexNoise();

let nPoints = 5
let points = []

for (let p = 0; p < nPoints; p++) {
  points.push({x: mapValues(Math.random(), 0, 1, -ngn.width/2, ngn.width/2), y: mapValues(Math.random(), 0, 1, -ngn.height/2, ngn.height/2)})
}

// DRAW

// the green line
svg.makeLine({
  parent: dom.svgLayer,
  id: "bezier",
  color: "#0f0",
  cap: "round",
  stroke: .2
})

// the red dots
svg.makeLine({
  parent: dom.svgLayer,
  id: "cpts",
  color: "#f00",
  cap: "round",
  stroke: 1
})

// ANIMATE

let path = svg.lineSoft(points)
let cpts = svg.dots(points)

// No Animation yet ¯\_(ツ)_/¯
function draw(t) {

  dom["bezier"].setAttributeNS(null, "d", path)
  dom["cpts"].setAttributeNS(null, "d", cpts)

  requestAnimationFrame(draw)
}

draw(0)