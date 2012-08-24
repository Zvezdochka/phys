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
        return d;
    }

    function getLinesIntersectPoint(point, velocityVector, linePoint1, linePoint2)
    {
console.info('getLinesIntersectPoint', point.toString(), velocityVector.toString(), linePoint1, linePoint2);        
        // intersection point of line (linePoint1, linePoint2) and perpendicular going through point)
        x0 = linePoint1.x;
        y0 = linePoint1.y;
        x1 = linePoint2.x;
        y1 = linePoint2.y;
        
        var xInter, yInter;

        if (x0 == x1) 
        {
            var prevX = body.getPrevPos().x;
            if ((velocityVector.x < 0) && (prevX > linePoint1.x)) 
            {
                // to the left inside
                xInter = linePoint1.x;
            } 
            else if ((velocityVector.x < 0) && (prevX > linePoint2.x)) 
            {
                // to the left outside
                xInter = linePoint2.x;
            } 
            else if ((velocityVector.x > 0) && (prevX < linePoint1.x)) 
            {
                // to the right outside
                xInter = linePoint1.x;
            } 
            else if ((velocityVector.x > 0) && (prevX < linePoint2.x)) 
            {
                // to the right inside
                xInter = linePoint2.x;
            }
            yInter = point.y;

            return that.phys.createVector(xInter, yInter);
        }
        var kLine = (y1 - y0) / (x0 - x1);
        var bLine = (x1 * y0 - x0 * y1) / (x0 - x1);

        if (y1 == y0) 
        {
            var prevY = body.getPrevPos().y;
            if ((velocityVector.y < 0) && (prevY > linePoint1.y)) 
            {
                // to the top outside
                yInter = linePoint1.y;
            } 
            else if ((velocityVector.y < 0) && (prevY > linePoint2.y)) 
            {
                // to the bottom inside
                yInter = linePoint2.y;
            } 
            else if ((velocityVector.y > 0) && (prevY < linePoint1.y)) 
            {
                // to the top inside
                yInter = linePoint1.y;
            } 
            else if ((velocityVector.y > 0) && (prevY < linePoint2.y)) 
            {
                // to the bottom outside
                yInter = linePoint2.y;
            }
            xInter = point.x;

            return that.phys.createVector(xInter, yInter);
        }
        var kPerp = (x1 - x0) / (y1 - y0);
        var bPerp = point.y - (x0 - x1) / (y1 - y0) * point.x;
        
        xInter = (bPerp - bLine) / (kLine - kPerp);
        yInter = kPerp * xInter + bPerp;

        return that.phys.createVector(xInter, yInter);
    }

    function rollback(distance, interPoint)
    {
        console.info('distance', distance, 'body', body);
        var sign = (sign = body.getPrevPos().clone().sub(interPoint)
                    .dotProduct(body.getPos().clone().sub(interPoint)), 
                    sign / Math.abs(sign));
        var overlap = sign * body.getRadius() - distance;
        if (overlap != 0) 
        { 
            flags.rollback_was = true;
        }
        var perpVector = body.getPos().clone().sub(interPoint);
        var perpUnitVector = perpVector.clone().div(distance);
        var correctionVector = perpUnitVector.clone().mult(overlap);
        console.info('correctionVector', correctionVector);
        body.moveBy(correctionVector, false);
    }

    var info = body.serviceStorage.boundBox;

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
            if (info.originalVelocityVector == null)
            {
                info.originalVelocityVector = velocityVector.clone();
            }
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
            if (info.originalVelocityVector == null)
            {
                info.originalVelocityVector = velocityVector.clone();
            }
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
            if (info.originalVelocityVector == null)
            {
                info.originalVelocityVector = velocityVector.clone();
            }
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
            if (info.originalVelocityVector == null)
            {
                info.originalVelocityVector = velocityVector.clone();
            }
            velocityVector.scale(-1, 1);
        }
    }

    info.processed = true;
 
}