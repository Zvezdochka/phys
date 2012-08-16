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

    var d1 = pointToLineDistance(body.getPos(), this.topLeft, this.topRight);
    var d2 = pointToLineDistance(body.getPos(), this.bottomLeft, this.bottomRight);
    var d3 = pointToLineDistance(body.getPos(), this.bottomLeft, this.topLeft);
    var d4 = pointToLineDistance(body.getPos(), this.bottomRight, this.topRight);

    if (d1 <= body.getRadius())
    {
        // collision was with top wall
        body.getExtantVelocityVector().scale(1, -1);       
    } else if (d2 <= body.getRadius())
    {
        // collision was with bottom wall
        body.getExtantVelocityVector().scale(1, -1);
    } else if (d3 <= body.getRadius())
    {
        // collision was with left wall
        body.getExtantVelocityVector().scale(-1, 1);
    } else if (d4 <= body.getRadius())
    {
        // collision was with right wall
        body.getExtantVelocityVector().scale(-1, 1);
    }

}