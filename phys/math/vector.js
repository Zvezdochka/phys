var Vector = function(x, y)
{
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(vector)
{
    this.x += vector.x;
    this.y += vector.y;
    return this;    
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

Vector.prototype.dotProduct = function(vector)
{
    return vector.x * this.x + vector.y * this.y;    
}

Vector.prototype.scale = function(scaleX, scaleY)
{
    this.x *= scaleX;
    this.y *= scaleY;
    return this;    
}

Vector.prototype.clone = function()
{
    return new this.constructor(this.x, this.y);
}

Vector.prototype.toString = function()
{
    return 'x: ' + this.x + ', y: ' + this.y;
}
