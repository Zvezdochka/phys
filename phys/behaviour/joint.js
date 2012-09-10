var JointBehaviour = function(phys, body1, body2) 
{
    this.phys = phys;
    this.body1 = body1;
    this.body2 = body2;
    this.body1.on('getVelocityVector', this.updateVelocityVector);
};

JointBehaviour.prototype.updateVelocityVector = function()
{
/*
build axis
get compound vector from body1
alongAxisPart = project vector on axis
comp2 = get compound vector from body2
compoundVector1 = add(alongAxisPart, comp2)
set compoundVector1 ;
*/
}

JointBehaviour.prototype.preApply = function()
{
    
}

JointBehaviour.prototype.apply = function()
{
    
}

JointBehaviour.prototype.postApply = function()
{
    
}

