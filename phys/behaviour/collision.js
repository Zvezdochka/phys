var CollisionBehaviour = function(phys, body1, body2) 
{
    this.phys = phys;
    this.body1 = body1;
    this.body2 = body2;
    this.processedCycle = null;
};

CollisionBehaviour.prototype.preApply = function(body)
{
    this.processedCycle = null;
}

CollisionBehaviour.prototype.apply = function(body)
{
}

CollisionBehaviour.prototype.postApply = function(body, flags)
{
    if (this.processedCycle == flags.cycleNumber) 
    { // if collision for pair of bodies was made
        return;
    }

    // check if collision was
    var r = this.body1.getDistanceTo(this.body2);
    var r1 = this.body1.getRadius();
    var r2 = this.body2.getRadius();

    if (r > r1 + r2)
    {
        // there wasn't collision
        return ;
    }

    // get vector from prev body1 pos to prev body2 pos (due to big overlap direction of central axis changes. that's why use angle between axis)
    var pos1 = this.body1.getPos(); // vector from 0,0 to body1
    var pos2 = this.body2.getPos(); // vector from 0,0 to body2

    var prevPos1 = this.body1.getPrevPos(); // vector from 0,0 to prev pos body1
    var prevPos2 = this.body2.getPrevPos(); // vector from 0,0 to prev pos body2 

    var B2B1Axis = pos1.clone().sub(pos2);            
    var prevB2B1Axis = prevPos1.clone().sub(prevPos2);            
    var axisAngleCos = B2B1Axis.dotProduct(prevB2B1Axis) / (B2B1Axis.length() * prevB2B1Axis.length());

    // if cos is less than zero, bodies swaped its' positions (during collision) 
    // in projection on central axis
    var sign = (axisAngleCos < 0 ? -1 : 1);
    var overlap = r1 + r2 - sign * r;
    
    var m1 = this.body1.getMass();
    var m2 = this.body2.getMass();

    // velocity exchange (if original velocity vector is not changed)
    if (this.processedCycle == null)
    {
        // get unit vectors
        var unitVectorX = B2B1Axis.clone().div(B2B1Axis.length());
        var unitVectorY = this.phys.createVector(-unitVectorX.y, unitVectorX.x);
        
        //Body 2 : decomposing velocity vector to components along unit vectors (unit vectors are basis)
        var velocity2Vector = this.body2.getExtantVelocityVector();
        var velocity2X = unitVectorX.dotProduct(velocity2Vector); //x-component of velocity of body2
        var velocity2Y = unitVectorY.dotProduct(velocity2Vector); //y-component of velocity of body2
        
        //Body 1
        var velocity1Vector = this.body1.getExtantVelocityVector();
        var velocity1X = unitVectorX.dotProduct(velocity1Vector); //x-component of velocity of body1
        var velocity1Y = unitVectorY.dotProduct(velocity1Vector); //y-component of velocity of body1

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

        this.body1.setExtantVelocityVector(newVelocity1Vector);

        //correction location
        var veloSum = 0;
        if (velocity1X * sign < 0) 
        {
            velocity1X = Math.abs(velocity1X);
            veloSum += velocity1X;
        } else 
        {
            velocity1X = 0;
        };

        if (velocity2X * sign > 0) 
        {
            velocity2X = Math.abs(velocity2X);
            veloSum += velocity2X;
        } else 
        {
            velocity2X = 0;
        };

    } else
    {
        //correction location
        var veloSum = 1;
        var velocity1X = 0.5;
        var velocity2X = 0.5;
    }
    
    if (veloSum > 0)
    {
        var rollback1 = sign * overlap * velocity1X / veloSum;
        var rollback2 = sign * overlap * velocity2X / veloSum;
        
        var rollvec1 = B2B1Axis.clone().mult(rollback1 / B2B1Axis.length())
        var rollvec2 = B2B1Axis.clone().mult(-rollback2 / B2B1Axis.length())

        this.body1.moveBy(rollvec1, false);
        this.body2.moveBy(rollvec2, false);

        flags.rollback_was = (overlap != 0 ? true : flags.rollback_was);
    }

    this.processedCycle = flags.cycleNumber;
}
