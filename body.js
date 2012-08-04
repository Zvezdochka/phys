var Body = function(phys, mass, pos)
{
    this.phys = phys;
    this.mass = mass;
    this.pos = pos;
    this.forces = [];
    this.compoundVector = phys.createVector(0, 0);
}

Body.prototype.getMass = function()
{
    return this.mass;
}

Body.prototype.getPos = function()
{
    return this.pos;
}

Body.prototype.moveBy = function(vector)
{
    this.pos.x += vector.x;
    this.pos.y += vector.y;
}

Body.prototype.getDistanceTo = function(target)
{
    dx = this.pos.x - target.getPos().x;
    dy = this.pos.y - target.getPos().y;
    return Math.sqrt(dx * dx + dy * dy);
}

Body.prototype.iterateForces = function(handler)
{
    this.forces.forEach(handler);
}

Body.prototype.addForceVector = function(forceVector)
{
    this.compoundVector.add(forceVector);

}
Body.prototype.resetForceVectors = function()
{
    this.compoundVector = this.phys.createVector(0, 0);
}

Body.prototype.getAccelerationVector = function()
{
    this.compoundVector.clone().div(this.mass);
}