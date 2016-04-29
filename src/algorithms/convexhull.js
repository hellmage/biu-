function tan (p0, p1) {
  return p0.y.sub(p1.y).div(p0.x.sub(p1.x))
}

function traverse (points) {
  var halfHull = [points[0]]
  var i = 1
  while (i < points.length) {
    var p = points[i]
    var last = halfHull[halfHull.length - 1]
    if (p.x.eq(last.x)) {
      i++
      continue
    }
    if (halfHull.length === 1) {
      halfHull.push(p)
      i++
      continue
    }
    var prev = halfHull[halfHull.length - 2]
    if (tan(p, last).lt(tan(last, prev))) {
      halfHull.push(p)
      i++
    } else {
      halfHull.pop()
    }
  }
  return halfHull
}

export var build = function (points) {
  if (points.length <= 3) {
    return points
  }
  // upper hull
  points.sort(function (p1, p2) {
    var dx = p1.x.sub(p2.x)
    if (dx.eq(0)) {
      return p2.y.sub(p1.y).valueOf()
    } else {
      return dx.valueOf()
    }
  })
  var upperHull = traverse(points)
  // lower hull
  points.reverse()
  var lowerHull = traverse(points)
  if (upperHull[upperHull.length - 1].equals(lowerHull[0])) {
    upperHull.pop()
  }
  if (upperHull[0].equals(lowerHull[lowerHull.length - 1])) {
    lowerHull.pop()
  }
  return upperHull.concat(lowerHull)
}
