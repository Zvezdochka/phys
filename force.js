var Force = function(phys, body1, body2) 
{
    this.phys = phys;
    this.body1 = body1;
    this.body2 = body2;
};

Force.prototype.getVector = function(body1, body2)
{
    var r = body1.getDistanceTo(body2);
    var m1 = body1.getMass();
    var m2 = body2.getMass();

    if (r <= 10) {
        return this.phys.createVector(0, 0);
    }

    var G = 2000;
    var forceMod = G * (m1 * m2) / (r * r);

    var pos1 = body1.getPos();
    var pos2 = body2.getPos();

    var vector1 = this.phys.createVector(pos1.x, pos1.y); // vector from 0,0 to body1
    var vector2 = this.phys.createVector(pos2.x, pos2.y); // vector from 0,0 to body2

    vector2.sub(vector1)            // get vector from body1 to body2
           .mult(forceMod / r); 

    return vector2;
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