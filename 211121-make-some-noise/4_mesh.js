// SETUP STUFF


//drehung
lineRotation = function ({ point, long, rotation }) {
    return [
        { x: point.x, y: point.y },
        { x: point.x + Math.sin(rotation) * long, y: point.y + Math.cos(rotation) * long }
    ];
};

let simplex = new SimplexNoise();


// SETUP

let nCols = 10
let nRows = nCols

// MAKE MESH WITH NOISE