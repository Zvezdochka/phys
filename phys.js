var Phys = function()
{
    this.bodies = [];
}

Phys.prototype.createPoint = function(x, y)
{
    return new Point(x, y);
}

Phys.prototype.createVector = function(x, y)
{
    return new Vector(x, y);
}

Phys.prototype.createBody = function(x, y, mass)
{
    return new Body(this, mass, this.createPoint(x, y));
}

Phys.prototype.createForce = function(body1, body2)
{
    return new Force(this, body1, body2);
}

Phys.prototype.registerBody = function(body)
{
    this.bodies.push(body);
}

Phys.prototype.unregisterBody = function(body)
{
    var idx = this.bodies.indexOf(body);
    this.bodies.splice(idx, 1);
}