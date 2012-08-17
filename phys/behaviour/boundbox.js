var BoundBoxBehaviour = function(phys, x1, y1, x2, y2)
{
    this.phys = phys;

    this.topLeft = phys.createVector(x1, y1);
    this.topRight = phys.createVector(x2, y1);
    this.bottomLeft = phys.createVector(x1, y2);
    this.bottomRight = phys.createVector(x2, y2);
}

BoundBoxBehaviour.prototype.preApply = function(body)
{
}

BoundBoxBehaviour.prototype.apply = function(body)
{
}

BoundBoxBehaviour.prototype.postApply = function(body)
{
    var that = this;

    function pointToLineDistance(point, linePoint1, linePoint2)
    {
        x0 = linePoint1.x;
        y0 = linePoint1.y;
        x1 = linePoint2.x;
        y1 = linePoint2.y;

        /* d = Ax+By+C / sqrt(A^2 + B^2)*/
        var d = (y0 - y1) * point.x + (x1 - x0) * point.y + (x0 * y1 - y0 * x1);
        d /= Math.sqrt(Math.pow((y0 - y1), 2) + Math.pow((x1 - x0), 2)); 
        return Math.abs(d);
    }

    function getLinesIntersectPoint(point, linePoint1, linePoint2)
    {
console.info('getLinesIntersectPoint', point, linePoint1, linePoint2);        
        // intersection point of line (linePoint1, linePoint2) and perpendicular going through point)
        x0 = linePoint1.x;
        y0 = linePoint1.y;
        x1 = linePoint2.x;
        y1 = linePoint2.y;
        
        var kLine = (y1 - y0) / (x0 - x1);
        var kPerp = (x1 - x0) / (y1 - y0);
        var bLine = (x1 * y0 - x0 * y1) / (x0 - x1);
        var bPerp = point.y - (x0 - x1) / (y1 - y0) * point.x;
        var xInter = (bPerp - bLine) / (kLine - kPerp);
        var yInter = kPerp * xInter + bPerp;

        return that.phys.createVector(xInter, yInter);
    }

    function rollback(distance, interPoint)
    {
        var overlap = body.getRadius() - distance;
        var perpVector = body.getPos().clone().sub(interPoint);
        var perpUnitVector = perpVector.clone().div(distance);
        var correctionVector = perpUnitVector.clone().mult(overlap);
        console.info('correctionVector', correctionVector);
        body.moveBy(correctionVector);
    }

    var d1 = pointToLineDistance(body.getPos(), this.topLeft, this.topRight);
    var d2 = pointToLineDistance(body.getPos(), this.bottomLeft, this.bottomRight);
    var d3 = pointToLineDistance(body.getPos(), this.bottomLeft, this.topLeft);
    var d4 = pointToLineDistance(body.getPos(), this.bottomRight, this.topRight);

    if (d1 <= body.getRadius())
    {
        // collision was with top wall
        body.getExtantVelocityVector().scale(1, -1);       
console.info('pos', body);
        var interPoint = getLinesIntersectPoint(body.getPos(), this.topLeft, this.topRight);
console.info('interpoint', interPoint);
        rollback(d1, interPoint);
    } else if (d2 <= body.getRadius())
    {
        // collision was with bottom wall
        body.getExtantVelocityVector().scale(1, -1);
console.info('pos2', body);
        var interPoint = getLinesIntersectPoint(body.getPos(), this.bottomLeft, this.bottomRight);
console.info('interpoint', interPoint);        
        rollback(d2, interPoint);
    } else if (d3 <= body.getRadius())
    {
        // collision was with left wall
        body.getExtantVelocityVector().scale(-1, 1);
console.info('pos3', body);        
        var interPoint = getLinesIntersectPoint(body.getPos(), this.bottomLeft, this.topLeft);
console.info('interpoint', interPoint);        
        rollback(d3, interPoint);
    } else if (d4 <= body.getRadius())
    {
        // collision was with right wall
        body.getExtantVelocityVector().scale(-1, 1);
console.info('pos4', body);        
        var interPoint = getLinesIntersectPoint(body.getPos(), this.bottomRight, this.topRight);
console.info('interpoint', interPoint);        
        rollback(d4, interPoint);
    }

 
}