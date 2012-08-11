var Interaction = function(phys, body1, body2) 
{
    this.phys = phys;
    this.body1 = body1;
    this.body2 = body2;
};

Interaction.prototype.getVectorBetweenBodies = function(body1, body2)
{
    // get vector from body1 to body2
    var pos1 = body1.getPos();
    var pos2 = body2.getPos();

    var vector1 = this.phys.createVector(pos1.x, pos1.y); // vector from 0,0 to body1
    var vector2 = this.phys.createVector(pos2.x, pos2.y); // vector from 0,0 to body2

    vector2.sub(vector1);            
}
