let w = ngn.width // total width (given)

let n = 3 // number of tiles (given)

let o = 3 // tiles overlap by a third (given)

let t // tilewidth (to be found)


// total width is this
// w = 2*o + ( n*t - ( (n-1) * o )


// now solve this for t (hmmmm)
// w = 2*(t / o) + ( n*t - ( (n-1) * (t / o) )


t = ( w*o ) / (-n + 3 + n * o)

let overlap = t / o // overlap (to be found)


// console.log(t, overlap)

// w = 100, n = 3
// 100 = ( 2* (t / 3) ) + ( 3*t - ( (3-1) * (t / 3) )
