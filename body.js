var Body = function(phys, mass, pos)
{
    this.phys = phys;
    this.mass = mass;
    this.pos = pos;
    this.forces = [];
    this.compoundVector = phys.createVector(0, 0);
    this.callbacks = {'onMoveBy': null};
    this.extantVelocityVector = phys.createVector(0, 0);
}

Body.prototype.getMass = function()
{
    return this.mass;
}

Body.prototype.getPos = function()
{
    return this.pos;
}

Body.prototype.onMoveBy = function(callback)
{
    this.callbacks.onMoveBy = callback;
}

Body.prototype.moveBy = function(vector)
{
    this.pos.x += vector.x;
    this.pos.y += vector.y;
    this.callbacks.onMoveBy(vector);
}

Body.prototype.getDistanceTo = function(target)
{
    dx = this.pos.x - target.getPos().x;
    dy = this.pos.y - target.getPos().y;
    return Math.sqrt(dx * dx + dy * dy);
}

Body.prototype.attachForce = function(force)
{
    this.forces.push(force);
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

Body.prototype.getVelocityVector = function()
{
    // instantaneous velocity = extant velocity * reductor + obtained velocity
    var obtainedVelocityVector = this.compoundVector.clone().div(this.mass); // obtained velocity = accelerationVector * step time = accelerationVector
    var instantVelocity = this.extantVelocityVector
                            .mult(reductor);
console.info('aftermult',instantVelocity)                            ;                            
                            instantVelocity = instantVelocity.add(obtainedVelocityVector);
console.info('afteradd',instantVelocity)                            ;
    this.extantVelocityVector = instantVelocity;
    return instantVelocity;
}