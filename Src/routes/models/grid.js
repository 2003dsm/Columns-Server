module.exports = class Grid{

    
    constructor(){
        this.x = 0;
        this.y = 0;
        this.color = 0;
    }

createPos(x,y){
    this.x = x;
    this.y = y;
}

setColor(color)
{
this.color = color;
}

moveNode(x,y)
{
this.x += x;
this.y += y;
}
}