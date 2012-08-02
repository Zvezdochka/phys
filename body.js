var Body = function(phys, mass, pos)
{
    this.phys = phys;
    this.mass = mass;
    this.pos = pos;
    this.forces = [];
}

Body.prototype.getMass = function()
{
    return this.mass;
}

Body.prototype.getPos = function()
{
    return this.pos;
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
