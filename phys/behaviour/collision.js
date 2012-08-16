var CollisionBehaviour = function(phys, body1, body2) 
{
    this.phys = phys;
    this.body1 = body1;
    this.body2 = body2;
    this.processed = false;
};

CollisionBehaviour.prototype.preApply = function(body)
{
    this.processed = false;
}

CollisionBehaviour.prototype.apply = function(body)
{
}

CollisionBehaviour.prototype.postApply = function(body)
{
    if (this.processed) 
    { // if collision for pair of bodies was made
        return;
    }

    // get vector from body1 to body2
    var pos1 = this.body1.getPos();
    var pos2 = this.body2.getPos();

    var vector1 = this.phys.createVector(pos1.x, pos1.y); // vector from 0,0 to body1
    var vector2 = this.phys.createVector(pos2.x, pos2.y); // vector from 0,0 to body2

    var deltaB2B1 = vector1.sub(vector2);            

    // check if collision was
    var r = this.body1.getDistanceTo(this.body2);
    var r1 = this.body1.getRadius();
    var r2 = this.body2.getRadius();
    if (r > r1 + r2)
    {
        // there wasn't collision
        return ;
    }
    
    var m1 = this.body1.getMass();
    var m2 = this.body2.getMass();

    // get unit vectors
    var unitVectorX = deltaB2B1.clone().div(r);
    var unitVectorY = this.phys.createVector(-unitVectorX.y, unitVectorX.x);
    
    //Body 2
    var velocity2Vector = this.body2.getExtantVelocityVector();
    var velocity2X = unitVectorX.dotProduct(velocity2Vector); //x-component of velocity of body2
    var velocity2Y = unitVectorY.dotProduct(velocity2Vector); //y-component of velocity of body2
    
    //Body 1
    var velocity1Vector = this.body1.getExtantVelocityVector();
    var velocity1X = unitVectorX.dotProduct(velocity1Vector); //x-component of velocity of body1
    var velocity1Y = unitVectorY.dotProduct(velocity1Vector); //y-component of velocity of body1

    console.info('velocity1Vector', velocity1Vector.toString());
    console.info('velocity2Vector', velocity2Vector.toString());

    //Body 2
    //x-component of velocity of body2 after collision
    var newVelocity2X = (2 * m1 * velocity1X + (m2 - m1) * velocity2X) / (m1 + m2);

    // making vectors from x,y-components
    var newVelocity2VectorX = unitVectorX.clone().mult(newVelocity2X);
    var velocity2VectorY = unitVectorY.clone().mult(velocity2Y);
    var newVelocity2Vector = newVelocity2VectorX.clone().add(velocity2VectorY);
    
    this.body2.setExtantVelocityVector(newVelocity2Vector);

    //Body 1
    //x-component of velocity of body1 after collision
    var newVelocity1X = (2 * m2 * velocity2X + (m1 - m2) * velocity1X) / (m1 + m2);

    // making vectors from x,y-components
    var newVelocity1VectorX = unitVectorX.clone().mult(newVelocity1X);
    var velocity1VectorY = unitVectorY.clone().mult(velocity1Y);
    var newVelocity1Vector = newVelocity1VectorX.clone().add(velocity1VectorY);

    //correction location
    var overlap = r1 + r2 - r;
    var veloSum = 0;
    if (velocity1X < 0) 
    {
        velocity1X = Math.abs(velocity1X);
        veloSum += velocity1X;
    } else 
    {
        velocity1X = 0;
    };

    if (velocity2X > 0) 
    {
        velocity2X = Math.abs(velocity2X);
        veloSum += velocity2X;
    } else 
    {
        velocity2X = 0;
    };

    console.info('veloSum', veloSum);
    if (veloSum > 0)
    {
        var rollback1 = overlap * velocity1X / veloSum;
        var rollback2 = overlap * velocity2X / veloSum;
        console.info('rollback1', rollback1);
        console.info('rollback2', rollback2);
        this.body1.moveBy(deltaB2B1.clone().mult(rollback1 / r));
        this.body2.moveBy(deltaB2B1.clone().mult(-rollback2 / r));
    }

    this.body1.setExtantVelocityVector(newVelocity1Vector);

    this.processed = true;
}
