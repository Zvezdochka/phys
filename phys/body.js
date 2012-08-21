var Body = function(phys, mass, pos)
{
    this.phys = phys;
    this.mass = mass;
    this.pos = pos;
    this.prevPos = null;
    this.behaviours = [];
    this.compoundVector = phys.createVector(0, 0);
    this.callbacks = {'onMoveBy': null};
    this.extantVelocityVector = phys.createVector(0, 0);
    this.serviceStorage = {};
}

Body.prototype.getMass = function()
{
    return this.mass;
}

Body.prototype.getRadius = function()
{
    return this.mass;
}

Body.prototype.getPos = function()
{
    return this.pos;
}

Body.prototype.getPrevPos = function()
{
    return this.prevPos;
}

Body.prototype.onMoveBy = function(callback)
{
    this.callbacks.onMoveBy = callback;
}

Body.prototype.moveBy = function(vector, updatePrevPos)
{
    updatePrevPos = updatePrevPos == undefined ? true : updatePrevPos;
    if (updatePrevPos)
    {
        this.prevPos = this.pos.clone();
    }
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

Body.prototype.attachBehaviour = function(behaviour)
{
    this.behaviours.push(behaviour);
}

Body.prototype.iterateBehaviours = function(handler)
{
    this.behaviours.forEach(handler);
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
                              .mult(reductor)
                              .add(obtainedVelocityVector);
    
    this.extantVelocityVector = instantVelocity;
    return instantVelocity;
}

Body.prototype.getExtantVelocityVector = function()
{
    return this.extantVelocityVector;
}

Body.prototype.setExtantVelocityVector = function(vector)
{
    this.extantVelocityVector = vector;
}