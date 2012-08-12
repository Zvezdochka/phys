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

Phys.prototype.createBody = function(mass, x, y)
{ 
    return new Body(this, mass, this.createPoint(x, y));
}

Phys.prototype.createAttractionBehaviour = function(body1, body2)
{
    return new AttractionBehaviour(this, body1, body2);
}

Phys.prototype.createCollisionBehaviour = function(body1, body2)
{
    return new CollisionBehaviour(this, body1, body2);
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

Phys.prototype.step = function()
{
    this.bodies.forEach(function(body)
    {
        body.iterateBehaviours(function(behaviour)
        {
            behaviour.preApply(body);
        });
    }); 

    // motion
    this.bodies.forEach(function(body)
    {
        body.resetForceVectors();
        body.iterateBehaviours(function(behaviour)
        {
            behaviour.apply(body);
        });
        
        var velocityVector = body.getVelocityVector();
        body.moveBy(velocityVector);
    });

    // motion post processing (i.e. detecting collisions)
    this.bodies.forEach(function(body)
    {
        body.iterateBehaviours(function(behaviour)
        {
            behaviour.postApply(body);
        });
    });    
}