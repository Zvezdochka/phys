var Vector = function(x, y)
{
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(vector)
{
    this.x += vector.x;
    this.y += vector.y;
}

Vector.prototype.sub = function(vector)
{
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
}

Vector.prototype.div = function(number)
{
    this.x /= number;
    this.y /= number;
    return this;    
}

Vector.prototype.mult = function(number)
{
    this.x *= number;
    this.y *= number;
    return this;    
}

Vector.prototype.clone = function()
{
    return new this.constructor(this.x, this.y);
}


