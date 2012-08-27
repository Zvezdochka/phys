var Phys = function()
{
    this.bodies = [];
    this.stepNumber = 0;
}

Phys.prototype.createPoint = function(x, y)
{
    return new Point(x, y);
}

Phys.prototype.createVector = function(x, y)
{
    return new Vector(x, y);
}

Phys.prototype.createBody = function(id, mass, x, y)
{ 
    return new Body(this, id, mass, this.createVector(x, y));
}

Phys.prototype.createAttractionBehaviour = function(body1, body2)
{
    return new AttractionBehaviour(this, body1, body2);
}

Phys.prototype.createCollisionBehaviour = function(body1, body2)
{
    return new CollisionBehaviour(this, body1, body2);
}

Phys.prototype.createBoundBoxBehaviour = function(x1, y1, x2, y2)
{
    return new BoundBoxBehaviour(this, x1, y1, x2, y2);
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
    this.stepNumber++; 

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

    var flags = {'rollback_was': false};
    // motion post processing (i.e. detecting collisions)
    do
    {
        flags.rollback_was = false;
        this.bodies.forEach(function(body)
        {
            body.iterateBehaviours(function(behaviour)
            {
                behaviour.postApply(body, flags);
            });
        });    
    } while (flags.rollback_was);
}

Phys.prototype.getStepNumber = function()
{
    return this.stepNumber;
}