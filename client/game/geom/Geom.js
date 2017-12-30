import Point from "./Point";

export const getIntersectionCoef = (p0, p1, p2, p3) => (
  (((p3.x - p2.x) * (p0.y - p2.y)) - ((p3.y - p2.y) * (p0.x - p2.x)))
  /
  (((p3.y - p2.y) * (p1.x - p0.x)) - ((p3.x - p2.x) * (p1.y - p0.y)))
);

export const getIntersectionCoef2 = (p0, p1, p2, p3) => (
  (((p1.x - p0.x) * (p0.y - p2.y)) - ((p1.y - p0.y) * (p0.x - p2.x)))
  /
  (((p3.y - p2.y) * (p1.x - p0.x)) - ((p3.x - p2.x) * (p1.y - p0.y)))
);

export const isect4Points = (p0, p1, p2, p3) => {
  const t = getIntersectionCoef(p0, p1, p2, p3);
  return p1.clone().sub(p0).mul(t).add(p0);
};

export const isectLineCircle = (p0, p1, cc, r) => {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const a = dx * dx + dy * dy;
  const b = 2 * (dx * (p0.x - cc.x)) + 2 * dy * (p0.y - cc.y);
  const c = (p0.x - cc.x) * (p0.x - cc.x) + (p0.y - cc.y) * (p0.y - cc.y) - r * r;
  const det = b * b - 4 * a * c;
  if (det < 0) return null;

  const detSqrt = Math.sqrt(det);
  // const t1 = (-b + detSqrt) / (2 * a);
  // const t2 = (-b - detSqrt) / (2 * a);
  const t1 = (2 * c) / (-b + detSqrt);
  const t2 = (2 * c) / (-b - detSqrt);
  // console.log(p0, p1, cc, r)
  // console.log(a, b, c)
  // console.log(t1, t2)
  // console.log(
  //   new Point(dx, dy)
  //   , new Point(dx, dy).mul(t1)
  // );

  const isect1 = new Point(dx, dy).mul(t1).add(p0);
  const isect2 = new Point(dx, dy).mul(t2).add(p0);

  // if (p0.dist2(isect2) > p0.dist2(isect1)) console.log('ALT');
  return p0.dist2(isect1) > p0.dist2(isect2) ? isect1 : isect2;
};

// export const isectLineCircle = (p0, p1, cc, r) => {
//   const a = (c2u.x * c2u.x) + (c2u.y * c2u.y);
//   const b = 2 * (c2u.x * -c2u.x) + 2 * (c2u.y * -c2u.y);
//   const c = (c2u.x * c2u.x) + (c2u.y * c2u.y) - (r * r);
//
//   const disc = b * b - 4 * a * c;
//   if (disc < 0) {
//     return null;
//   }
//
//   const t = 2 * c / (-b + Math.sqrt(disc));
//   if (t < 0 || t > 1) {
//     return null;
//   }
//
//   return c2u.clone().mul(-t)
// }


export const checkIsectRectCircle = (rectLoc, rectHalfSize, circleLoc, circleRadius) => {
  const circleDistance = new Point(circleLoc).sub(rectLoc).abs();

  if (circleDistance.x >= (rectHalfSize + circleRadius)) return false;
  if (circleDistance.y >= (rectHalfSize + circleRadius)) return false;

  if (circleDistance.x < (rectHalfSize)) return true;
  if (circleDistance.y < (rectHalfSize)) return true;

  const cornerDistance_sq = Math.pow(circleDistance.x - rectHalfSize, 2) + Math.pow(circleDistance.y - rectHalfSize, 2);

  return (cornerDistance_sq < (circleRadius * circleRadius));
};


// function checkCellUnitIntersection(halfCellSize, cellLoc, unitLoc, unitRadius) {
//   const circleDistance = new Point(unitLoc).sub(cellLoc).abs();
//
//   if (circleDistance.x >= (halfCellSize + unitRadius)) return false;
//   if (circleDistance.y >= (halfCellSize + unitRadius)) return false;
//
//   if (circleDistance.x < (halfCellSize)) return true;
//   if (circleDistance.y < (halfCellSize)) return true;
//
//   const cornerDistance_sq = Math.pow(circleDistance.x - halfCellSize, 2) + Math.pow(circleDistance.y - halfCellSize, 2);
//
//   return (cornerDistance_sq < (unitRadius * unitRadius));
// }