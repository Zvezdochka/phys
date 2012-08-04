var Force = function(phys, body1, body2) 
{
    this.phys = phys;
    this.body1 = body1;
    this.body2 = body2;
};

Force.prototype.getVector = function(body1, body2)
{
    var r = body1.getDistanceToBody(body2);
    var m1 = body1.getMass();
    var m2 = body2.getMass();

    var forceMod = (m1 * m2) / (r * r);

    var x1 = body1.getPos().x;
    var y1 = body1.getPos().y;

    var x2 = body2.getPos().x;
    var y2 = body2.getPos().y;

    var x = (x2 - x1) * forceMod / r + x1;  // (x-x1) / (x2-x1) = forceMod / r 
    var y = (x - x1) * (y2 - y1) / (x2 - x1) + y1; // dx/dy = (x-x1) / (y-y1) = (x2-x1) / (y2-y1)

    return this.phys.createVector(x, y);
}

Force.prototype.apply = function(body)
{
    if (body == this.body1) 
    {
        var b1 = this.body1;
        var b2 = this.body2;
    } else
    {
        var b1 = this.body2;
        var b2 = this.body1;
    }

    var forceVector = this.getVector(b1, b2);
    body.addForceVector(forceVector);
console.info(forceVector);
}