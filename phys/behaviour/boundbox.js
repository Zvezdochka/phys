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
    body.serviceStorage.boundBox = 
    {
        'processed' : false,
        'originalVelocityVector' : null
    };
}

BoundBoxBehaviour.prototype.apply = function(body)
{
}

BoundBoxBehaviour.prototype.postApply = function(body, flags)
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
        return d.toFixed(3);
    }

    function getLinesIntersectPoint(point, velocityVector, linePoint1, linePoint2)
    {
        //console.info('getLinesIntersectPoint', point.toString(), velocityVector.toString(), linePoint1, linePoint2);        
        // intersection point of line (linePoint1, linePoint2) and perpendicular going through point)
        var x0 = linePoint1.x;
        var y0 = linePoint1.y;
        var x1 = linePoint2.x;
        var y1 = linePoint2.y;
        
        if (x0 == x1) 
        {
            return that.phys.createVector(x0, point.y);
        }
        var kLine = (y1 - y0) / (x0 - x1);
        var bLine = (x1 * y0 - x0 * y1) / (x0 - x1);

        if (y1 == y0) 
        {
            return that.phys.createVector(point.x, y0);
        }
        var kPerp = (x1 - x0) / (y1 - y0);
        var bPerp = point.y - (x0 - x1) / (y1 - y0) * point.x;
        
        var xInter = (bPerp - bLine) / (kLine - kPerp);
        var yInter = kPerp * xInter + bPerp;

        return that.phys.createVector(xInter, yInter);
    }

    function rollback(distance, interPoint)
    {
        //console.info('distance', distance, 'body', body);
        var sign = (sign = body.getPrevPos().clone().sub(interPoint)
                    .dotProduct(body.getPos().clone().sub(interPoint)), 
                    sign / Math.abs(sign));
        var overlap = sign * body.getRadius() - distance;
        if (overlap != 0) 
        { 
            flags.rollback_was = true;
        }

        /* Защита от деления вектора perpVector на 0 */
        distance = (distance != 0 ? distance : 1);
        var perpVector = body.getPos().clone().sub(interPoint);
        var perpUnitVector = perpVector.clone().div(distance);
        var correctionVector = perpUnitVector.clone().mult(overlap);
        
        //console.info('correctionVector', correctionVector);
        body.moveBy(correctionVector, false);
    }

    var info = body.serviceStorage.boundBox;
    if (!info.processed)
    {
        if (info.originalVelocityVector == null)
        {
            info.originalVelocityVector = body.getExtantVelocityVector().clone();
        }
    }

    var d1 = pointToLineDistance(body.getPos(), this.topLeft, this.topRight);
    var d2 = pointToLineDistance(body.getPos(), this.bottomLeft, this.bottomRight);
    var d3 = pointToLineDistance(body.getPos(), this.bottomLeft, this.topLeft);
    var d4 = pointToLineDistance(body.getPos(), this.bottomRight, this.topRight);
    var prevd1 = pointToLineDistance(body.getPrevPos(), this.topLeft, this.topRight);
    var prevd2 = pointToLineDistance(body.getPrevPos(), this.bottomLeft, this.bottomRight);
    var prevd3 = pointToLineDistance(body.getPrevPos(), this.bottomLeft, this.topLeft);
    var prevd4 = pointToLineDistance(body.getPrevPos(), this.bottomRight, this.topRight);

    if ((Math.abs(d1) <= body.getRadius()) || (d1 * prevd1 < 0))
    {
        // collision was with top wall
        var velocityVector = info.processed ? info.originalVelocityVector : body.getExtantVelocityVector(); // first collision processing or not
        var interPoint = getLinesIntersectPoint(body.getPos(), velocityVector, this.topLeft, this.topRight);
        rollback(Math.abs(d1), interPoint); 

        if (!info.processed)
        {
            velocityVector.scale(1, -1);
        }
    }

    if ((Math.abs(d2) <= body.getRadius()) || (d2 * prevd2 < 0))
    {
        // collision was with bottom wall
        var velocityVector = info.processed ? info.originalVelocityVector : body.getExtantVelocityVector(); // first collision processing or not
        var interPoint = getLinesIntersectPoint(body.getPos(), velocityVector, this.bottomLeft, this.bottomRight);
        rollback(Math.abs(d2), interPoint);

        if (!info.processed)
        {
            velocityVector.scale(1, -1);
        }
    }

    if ((Math.abs(d3) <= body.getRadius()) || (d3 * prevd3 < 0))
    {
        // collision was with left wall
        var velocityVector = info.processed ? info.originalVelocityVector : body.getExtantVelocityVector(); // first collision processing or not
        var interPoint = getLinesIntersectPoint(body.getPos(), velocityVector, this.bottomLeft, this.topLeft);
        rollback(Math.abs(d3), interPoint);

        if (!info.processed)
        {
            velocityVector.scale(-1, 1);
        }
    }

    if ((Math.abs(d4) <= body.getRadius()) || (d4 * prevd4 < 0))
    {
        // collision was with right wall
        var velocityVector = info.processed ? info.originalVelocityVector : body.getExtantVelocityVector(); // first collision processing or not
        var interPoint = getLinesIntersectPoint(body.getPos(), velocityVector, this.bottomRight, this.topRight);
        rollback(Math.abs(d4), interPoint);

        if (!info.processed)
        {
            velocityVector.scale(-1, 1);
        }
    }

    info.processed = true;
}