var Body = function(phys, id, mass, pos)
{
    this.phys = phys;
    this.id = id;
    this.mass = mass;
    this.pos = pos;
    this.prevPos = null;
    this.behaviours = [];
    this.compoundVector = phys.createVector(0, 0);
    this.callbacks = {'moveBy': [], 'getVelocityVector': []};
    this.extantVelocityVector = phys.createVector(0, 0);
    this.serviceStorage = {};
}

Body.prototype.getId = function()
{
    return this.id;
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

Body.prototype.setPrevPos = function(pos)
{
    this.prevPos = pos.clone();
}

Body.prototype.on = function(eventName, callback)
{
    this.callbacks[eventName].push(callback);
}

Body.prototype.callEventHandlers = function(eventName, argumentsArray)
{
    this.callbacks[eventName].forEach(function(handler)
    {
        handler.apply(window, argumentsArray)
    });
}

Body.prototype.moveBy = function(vector, updatePrevPos)
{
    updatePrevPos = updatePrevPos == undefined ? true : updatePrevPos;
    if (updatePrevPos)
    {
        this.setPrevPos(this.pos);
    }
    
    this.pos.x += vector.x;
    this.pos.y += vector.y;
    this.callEventHandlers('moveBy', [vector]);
}

Body.prototype.getDistanceTo = function(target)
{
    dx = this.pos.x - target.getPos().x;
    dy = this.pos.y - target.getPos().y;
    return Math.sqrt(dx * dx + dy * dy).toFixed(3);
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
    this.callEventHandlers('getVelocityVector');
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