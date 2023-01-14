const Grid = require("../models/grid");

module.exports = class Player{

    
    constructor(idPlayer){
        this.id = idPlayer;
        this.grid = new Grid(6);
        this.model;
        this.end = false;
        for(var i = 0; i <6;i++)
        {
            this.grid[i] = new Grid(12);
            for(var e = 0; e <12;e++)
            {
                this.grid[i][e] = new Grid();
            }
        }
        this.createGrid();
        this.createModel();
        this.destroyGrids = [];
        this.nextMove = [];

        this.red = [];
        this.blue = [];
        this.green = [];

        this.redSave = [];
        this.blueSave = [];
        this.greenSave = [];

        this.destroy = false;
  
        this.destroyRed = false;
        this.destroyBlue = false;
        this.destroyGreen = false;


        this.colorRed = 0;
        this.colorBlue = 0;
        this.colorGreen = 0;

        this.move = false;
    }
    //Caer despuess de destruir
    moveDown()
    {
        this.destroyGrids = [];
        this.destroyRed = false;
        this.destroyBlue = false;
        this.destroyGreen = false;
        this.red = [];
        this.blue = [];
        this.green = [];

        this.redSave = [];
        this.blueSave = [];
        this.greenSave = [];

        for(var i = 0; i < 6; i++)
        {
            var end = false;
            var y = 12;
            do{
                y--;
                if(this.grid[i][y].color == 0)
                {
                    end = true;
                }
                

                
            }while(!end)
            end = false;
console.log(y);
            var Y = y;
            do 
            {
                y--;
                if(y >= 0)
                {
                        if(this.grid[i][y].color != 0)
                        {
                            end = true;

                        } 
                }
                else{
                    end = true;
                }
                
            }while(!end)
            console.log(y);

            end = false;
            if(y >= 0)
            {

                do{
                    console.log(y);
                    console.log(Y);

                    if(this.grid[i][y].color != 0)
                    {
                        var move = new Grid();
                        move.createPos(this.grid[i][Y].x,this.grid[i][Y].y);
                        move.setColor(this.grid[i][y].color);

                        this.nextMove.push(move);

                        var move2 = new Grid();
                        move2.createPos(this.grid[i][y].x,this.grid[i][y].y);
                        move2.setColor(0);

                        this.nextMove.push(move2);
                    }

                    y--;
                    Y--;

                    if(y <0)
                    {
                        end = true;
                    }
                }while(!end)
            }

        }
    }
    //Buscar colores iguales alrededor de la casilla
    alrededor(x,y,find,color)
    { 



        for(var X = -1; X < 2; X++)
        {
            for(var Y = -1; Y < 2; Y++)
            {
                if(x+X != -1 && x+X != 6 && y+Y != -1 && y+Y != 12)
                {
                    if(X != 0 || Y != 0)
                    {
                        if((this.grid[x+X][y+Y].color == color || this.grid[x+X][y+Y].color == 4 || color == 4) && this.grid[x+X][y+Y].color != 0)
                        {
                            var canAdd = true;
                            if(this.grid[x+X][y+Y].color == 4)
                            {
                                for(var  i = 0; i <this.red.length; i++)
                                {
     

                                    if(this.red[i].x == x+X && this.red[i].y == y+Y)
                                    {
                                        canAdd = false;
                                        console.log("Ya esta");
                                    }
                                }
                                for(var  i = 0; i <this.blue.length; i++)
                                {
  
                                    if(this.blue[i].x == x+X && this.blue[i].y == y+Y)
                                    {
                                        canAdd = false;
                                        console.log("Ya esta");

                                    }
                                }    
                                 for(var  i = 0; i <this.green.length; i++)
                                {
      
                                    if(this.green[i].x == x+X && this.green[i].y == y+Y)
                                    {
                                        canAdd = false;
                                        console.log("Ya esta");

                                    }
                                }     
                                       
                            }
                            else if(color == 1)
                            {
                                console.log("RED");
                                console.log(this.red.length);
                         
                                for(var  i = 0; i <this.red.length; i++)
                                {
                                    if(this.red[i].x == x+X && this.red[i].y == y+Y)
                                    {
                                        canAdd = false;
                                        console.log("Ya esta");
                                    }
                                }
                            }
                            else if(color == 2)
                            {                              
                                  console.log("BLUE");
                                  console.log(this.blue.length);
                       
                                for(var  i = 0; i <this.blue.length; i++)
                                {

                                    if(this.blue[i].x == x+X && this.blue[i].y == y+Y)
                                    {
                                        canAdd = false;
                                        console.log("Ya esta");

                                    }
                                }                            
                            }
                            else if(color == 3)
                            {
                                console.log("GREEN");
                                    console.log(this.green.length);
                       
                                for(var  i = 0; i <this.green.length; i++)
                                {

                                    if(this.green[i].x == x+X && this.green[i].y == y+Y)
                                    {
                                        canAdd = false;
                                        console.log("Ya esta");

                                    }
                                }                            
                            }      

                            if(canAdd)
                            {

                                var destroyGrid = new Grid();
                                destroyGrid.createPos(this.grid[x][y].x,this.grid[x][y].y);
                                destroyGrid.setColor(0);
                                    console.log(destroyGrid);
                                
                                if(color == 4)
                                {
                                    this.colorBlue++;
                                    this.colorGreen++;
                                    this.colorRed++;
                                    this.red.push(destroyGrid);
                                    this.blue.push(destroyGrid);
                                    this.green.push(destroyGrid);

                                }
                                else if(color == 1 )
                                {
                                    this.colorRed++;
                                    console.log(this.red[0]);
                                    this.red.push(destroyGrid);
                                    console.log(this.red[0]);

                                }
                                else if(color == 2)
                                {
                                    this.colorBlue++;
                                    console.log(this.blue[0]);

                                    this.blue.push(destroyGrid);
                                    console.log(this.blue[0]);

                                }
                                else if(color == 3)
                                {
                                    this.colorGreen++;
                                    console.log(this.green[0]);

                                    this.green.push(destroyGrid);
                                    console.log(this.green[0]);

                                }

                                this.alrededor(x+X, y+Y, find+1,this.grid[x+X][y+Y].color);

                                

                            }

                        }


                    }
                }
            }
        }

        var destroyGrid = new Grid();
        destroyGrid.createPos(this.grid[x][y].x,this.grid[x][y].y);
        destroyGrid.setColor(0);

        if(color == 1 )
        {
            this.colorRed++;
            this.red.push(destroyGrid);
        }
        else if(color == 2)
        {
            this.colorBlue++;
            this.blue.push(destroyGrid);
        }
        else if(color == 3)
        {
            this.colorGreen++;
            this.green.push(destroyGrid);
        }

    
            this.destroy = true;

            if(color == 4)
            {
                if(this.red.length > 2)
                {
                    color = 1;
                }
                else if(this.blue.length > 2)
                {
                    color = 2;
                }
                else if(this.green.length > 2)
                {
                    color = 3;
                }
            }
            if(color == 1 && this.colorRed >=3)
            {          
                  this.destroyRed = false;

                for(var i = 0; i <this.red.length; i++)
                {
                    var canAdd = true;
                    for(var e = 0; e <this.redSave.length; e++)
                    {
                        if(this.red[i].x == this.redSave[e].x &&this.red[i].y == this.redSave[e].y)
                        {
                            canAdd = false;
                        }
                    }
                    if(canAdd)
                    {
                        this.redSave.push(this.red[i]);
                        this.destroyGrids.push(this.red[i])
                    }
                }

            }
            else if(color == 2 && this.colorBlue >=3)
            {            
            this.destroyBlue = false;

                for(var i = 0; i <this.blue.length; i++)
                {
                    var canAdd = true;
                    for(var e = 0; e <this.blueSave.length; e++)
                    {
                        if(this.blue[i].x == this.blueSave[e].x &&this.blue[i].y == this.blueSave[e].y)
                        {
                            canAdd = false;
                        }
                    }
                    if(canAdd)
                    {
                        this.blueSave.push(this.blue[i]);
                        this.destroyGrids.push(this.blue[i])

                    }
                }            
            }
            else if(color == 3 && this.colorGreen >= 3)
            {
                this.destroyGreen = false;

                for(var i = 0; i <this.green.length; i++)
                {
                    var canAdd = true;
                    for(var e = 0; e <this.greenSave.length; e++)
                    {
                        if(this.green[i].x == this.greenSave[e].x &&this.green[i].y == this.greenSave[e].y)
                        {
                            canAdd = false;
                        }
                    }
                    if(canAdd)
                    {
                        this.greenSave.push(this.green[i]);
                        this.destroyGrids.push(this.green[i])

                    }
                }               
            }
        

    
    }
    destroyColor(x,y)
    {

                
        if(this.grid[x][y].color != 0)
        {
            this.alrededor(x,y,1,this.grid[x][y].color);

                    this.colorRed = 0;
        this.colorBlue = 0;
        this.colorGreen = 0;
        }

        this.red = [];
        this.blue = [];
        this.green = [];

    
    }


    resetColor(){
        var i = 0;
        var e = 0;
        for(var i = 0; i <6;i++)
        {
            for(var e = 0; e <12;e++)
            {
            this.grid[i][e].setColor(0);
            }
        }
    }
    createGrid(){
        var i = 0;
        var e = 0;
        for(var i = 0; i <6;i++)
        {
            for(var e = 0; e <12;e++)
            {
            this.grid[i][e].createPos(i,e);
            }
        }
    }
    
    createModel(){
        this.model = new Grid(3);
        for(var i = 0; i <3;i++)
        {
            this.model[i] = new Grid;
        }
        this.model[0].createPos(3,-3);
        this.model[0].setColor(Math.floor(Math.random()*(4-1+1)+1));

        this.model[1].createPos(3,-2);
        this.model[1].setColor(Math.floor(Math.random()*(4-1+1)+1));

        this.model[2].createPos(3,-1);
        this.model[2].setColor(Math.floor(Math.random()*(4-1+1)+1));
    }

    rotate(){
        var lastColor = this.model[2].color;

        this.model[2].color = this.model[1].color;
        this.model[1].color = this.model[0].color;
        this.model[0].color = lastColor;


    }

    moveModel(x,y)
    {
        if(y == 1)
        {
         if(this.model[2].y+1 != 12)
         {
                if(this.grid[this.model[2].x][this.model[2].y+1].color == 0)
                {
                    if(this.model[0].y >= 0)
                    {
                        this.grid[this.model[0].x][this.model[0].y].color = 0;
                    }

                    for(var i = 0; i <3;i++)
                    {
                        this.model[i].moveNode(0,1);
                        if(this.model[i].y >= 0)
                        {
                            this.grid[this.model[i].x][this.model[i].y].color = this.model[i].color;
                        }

                    }
                }
                else{
                    if(this.model[0].y == 0)
                    {
                        this.end = true;
                    }
                    for(var i = 0; i <3;i++)
                    {
                        this.destroyColor(this.model[i].x,this.model[i].y);

                    }
         

                    this.createModel();
                }
            
         }
         else{
            for(var i = 0; i <3;i++)
            {
                this.destroyColor(this.model[i].x,this.model[i].y);

            }

            this.createModel();
         }
        }
        else if(x == 1||x == -1)
        {
            var canMove = true;

            for(var i = 0; i <3;i++)
            {
                if(this.model[i].y >= 0)
                {
                    if(this.model[i].x+1 != 6 && this.model[i].x-1 != -1)
                    {
                        if(this.grid[this.model[i].x+1][this.model[i].y].color != 0)
                        {
                            canMove = false;
                        }
                        if(this.model[i].x +1 == 6)
                        {
                            canMove = false;
                        }
                        if(this.model[i].x -1 == -1)
                        {
                            canMove = false;
                        }
                        if(this.grid[this.model[i].x-1][this.model[i].y].color != 0)
                        {
                            canMove = false;
                        }
                    }
                }
            }

            if(canMove)
            {
                for(var i = 0; i <3;i++)
                {
                    if(this.model[i].y >= 0)
                    {
                    this.grid[this.model[i].x][this.model[i].y].color = 0;
                    }
                    this.model[i].moveNode(x,0);
                    if(this.model[i].y >= 0)
                    {
                    this.grid[this.model[i].x][this.model[i].y].color = this.model[i].color;
                    }
                }
            }
        }

    }

     
}