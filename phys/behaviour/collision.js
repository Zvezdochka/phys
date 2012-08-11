var CollisionBehaviour = function(phys, body1, body2) 
{
    this.phys = phys;
    this.body1 = body1;
    this.body2 = body2;
};

CollisionBehaviour.prototype.preApply = function(body)
{
}

CollisionBehaviour.prototype.apply = function(body)
{
}

CollisionBehaviour.prototype.postApply = function(body)
{
    // get vector from body1 to body2
    var pos1 = this.body1.getPos();
    var pos2 = this.body2.getPos();

    var vector1 = this.phys.createVector(pos1.x, pos1.y); // vector from 0,0 to body1
    var vector2 = this.phys.createVector(pos2.x, pos2.y); // vector from 0,0 to body2

    var deltaB2B1 = vector1.sub(vector2);            

    // check if collision was
    var r = this.body1.getDistanceTo(this.body2);
    if (r > this.body1.getRadius() + this.body2.getRadius())
    {
        // there wasn't collision
        return ;
    }
    
    var m1 = this.body1.getMass();
    var m2 = this.body2.getMass();

    // get unit vectors
    var unitVectorX = deltaB2B1.div(r);
    var unitVectorY = this.phys.createVector(unitVectorX.y, unitVectorX.x);
    
    //Body 2
    var velocity2Vector = this.body2.getExtantVelocityVector();
    var velocity2X = unitVectorX.dotProduct(velocity2Vector); //x-component of velocity of body2
    var velocity2Y = unitVectorY.dotProduct(velocity2Vector); //y-component of velocity of body2

    //Body 1
    var velocity1Vector = this.body1.getExtantVelocityVector();
    var velocity1X = unitVectorX.dotProduct(velocity1Vector); //x-component of velocity of body1
    var velocity1Y = unitVectorY.dotProduct(velocity1Vector); //y-component of velocity of body1

    //Body 2
    //x-component of velocity of body2 after collision
    var newVelocity2X = (2 * m2 * velocity2X + (m1 - m2) * velocity1X) / (m1 + m2);

    // making vectors from x,y-components
    var newVelocity2VectorX = unitVectorX.mult(newVelocity2X);
    var velocity2VectorY = unitVectorY.mult(velocity2Y);
    var newVelocity2Vector = newVelocity2VectorX.add(velocity2VectorY);
    
    this.body2.setExtantVelocityVector(newVelocity2Vector);

    //Body 1
    //x-component of velocity of body1 after collision
    var newVelocity1X = (2 * m1 * velocity1X + (m2 - m1) * velocity2X) / (m1 + m2);

    // making vectors from x,y-components
    var newVelocity1VectorX = unitVectorX.mult(newVelocity1X);
    var velocity1VectorY = unitVectorY.mult(velocity1Y);
    var newVelocity1Vector = newVelocity1VectorX.add(velocity1VectorY);

    this.body1.setExtantVelocityVector(newVelocity1Vector);
}
