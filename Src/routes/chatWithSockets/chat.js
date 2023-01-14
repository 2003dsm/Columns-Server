const { Router } = require("express");
const router = Router();

var mysql = require('mysql');
var con = mysql.createConnection({
host: "localhost", //No hace falta especifica rel puerto porque
//estamos usando el por defecto
user: "root",
password: "usuario", //Aqui vuestra password de la BDD
database: "baseDatos" //Ponemos el nombre de la BDD que vamos a
//usar
});

con.connect(function(err) {
if (err) throw err;
console.log("Connected!");


});





router.get("/", (req, res) =>{
    res.sendFile(__dirname + "/chat.html");
});

var io = app.get("io");

var messages = [];
var chatRooms = [];
const chatRoomsSemaphore = new require("semaphore")(1);
const Player = require("../models/player");

var players = [];
setPlayersInitRoom();

function enterRoom(player,room)
{
    io.emit("newPlayer", 
    {
        user: player,
        idRoom: room

    }
    );
}

function setPlayersInitRoom()
{
    const query3 = `SELECT idUser FROM User`;


    con.query(query3,function (err, result, fields) {

        var a = 0;
        var end = false;
        do{
            
            if(result[a] != null)
            {
                console.log(result[a]);
                const query2= `UPDATE User SET Room_idRoom = null WHERE idUser = '${result[a].idUser}'`;
                con.query(query2);
            }
            else{
                end = true;
            }
            a++;

        }while(!end)

    });
}

   function getRooms(){
    chatRooms = [];
        const query3 = `SELECT * FROM Room;`;
            
        con.query(query3, function (err, result, fields) {
        for(var a in result)
        {
            chatRoomsSemaphore.take(() =>{

            io.emit("clientRoomCreated", result[a].idRoom);

            chatRooms.push(result[a].idRoom.toString());
            
                chatRoomsSemaphore.leave();

            })
        }
        });


        console.log(chatRooms);
    };
    getRooms();

function GameLoop()
{

}
function emitGrid(grid)
{
    io.emit("newGrid", grid);
}

function clientConnected()
{
    io.emit("isClientConnected");
}
    function connectPlayer(idPlayer, socket, name)
    {


        var interval;

        var newPlayer = new Player(idPlayer);

        players.push(newPlayer);
    
        console.log("playerConnected");
        console.log(idPlayer);

        //console.log(players);

        socket.emit("connectPlay");
        socket.emit("setName",name);

        //Log out
        socket.on("disconnect", () => {
            const query = `CALL MovePlayerInRooms(?,?)`;

            con.query(query,[null,idPlayer]);

            clearInterval(interval);

        players.splice( players.findIndex(x => x.id === idPlayer), 1);
        console.log(players.findIndex(x => x.id === idPlayer));
        });




        socket.on("enterToRoom", (room) => {

            enterRoom(idPlayer, room);


            const query2 = `CALL MovePlayerInRooms(?,?)`;

            con.query(query2,[room,idPlayer]);


            const query = `CALL CreateMatch(?,?)`;

            con.query(query,[room, idPlayer]);
   
            const query3 = `CALL GetLastMatchIP()`;
            var partida;
            con.query(query3, function (err, result, fields) {
               
                console.log(result[0][0].idPartida);
                partida = result[0][0].idPartida;
   
            });


            var clientsConnected = 0;


            io.on("clientConnected", (roomId)=>{
                if(roomId == room)
                {
                    clientsConnected++;
                }
                console.log(clientsConnected);
            });

            io.on("clientDisconnected", (roomId)=>{
                if(roomId == room)
                {
                    clientsConnected--;
                }
                console.log(clientsConnected);

            });

            clientConnected();

            var pause = true;

            socket.on("pauseGame",()=>{
                pause = true;
            });

            socket.on("continue",()=>{
                pause = false;
            });

            socket.on("rotate",()=>{
                if(!pause )
                {              
                    newPlayer.rotate();
                }
            });

            var right = false;
            socket.on("moveRight",()=>{
                chatRoomsSemaphore.take(() =>{
          
      
                    if(!pause && newPlayer.model[0].x != 5 && newPlayer.destroy == false && newPlayer.move == false)
                    {  

                        for(var i = 0; i < 3; i++)
                        {
                            if(newPlayer.model[i].y >= 0)
                            {

                            
                                const query = `CALL InsertUpdateGrid(?,?,?,?,?,?,?)`;

                                con.query(query,[room,idPlayer,frame,partida,newPlayer.model[i].x,newPlayer.model[i].y,0]);
                            emitGrid({
                                x: newPlayer.model[i].x,
                                y: newPlayer.model[i].y,
                                color: 0,
                                player: idPlayer,
                                idRoom: room
                                
                            });

                        }
                        }
                        newPlayer.moveModel(1,0);
                       for(var i = 0; i <3;i++)
                        {
                            if(newPlayer.model[i].y >= 0)
                            {
                                const query = `CALL InsertUpdateGrid(?,?,?,?,?,?,?)`;

                                con.query(query,[room,idPlayer,frame,partida,newPlayer.model[i].x,newPlayer.model[i].y,newPlayer.model[i].color]);
                            emitGrid({
                                x: newPlayer.model[i].x,
                                y: newPlayer.model[i].y,
                                color: newPlayer.model[i].color,
                                player: idPlayer,
                                idRoom: room
                                
                            });

                        }
                        }
                    }   
                               chatRoomsSemaphore.leave();
                })
            });
            var left = false;
            socket.on("moveLeft",()=>{
                chatRoomsSemaphore.take(() =>{
          
             
                if(!pause&& newPlayer.model[0].x != 0 && newPlayer.destroy == false && newPlayer.move == false)
                {
                    for(var i = 0; i <3;i++)
                    {
                        if(newPlayer.model[i].y >= 0)
                        {
                            const query = `CALL InsertUpdateGrid(?,?,?,?,?,?,?)`;

                            con.query(query,[room,idPlayer,frame,partida,newPlayer.model[i].x,newPlayer.model[i].y,0]);
                        emitGrid({
                            x: newPlayer.model[i].x,
                            y: newPlayer.model[i].y,
                            color: 0,
                            player: idPlayer,
                            idRoom: room
                            
                        });

                    }
                    }
                    newPlayer.moveModel(-1,0);
                   for(var i = 0; i <3;i++)
                    {
                        if(newPlayer.model[i].y >= 0)
                        {
                            const query = `CALL InsertUpdateGrid(?,?,?,?,?,?,?)`;

                            con.query(query,[room,idPlayer,frame,partida,newPlayer.model[i].x,newPlayer.model[i].y,newPlayer.model[i].color]);                        console.log({
                            x: newPlayer.model[i].x,
                            y: newPlayer.model[i].y,
                            color: newPlayer.model[i].color,
                            player: idPlayer,
                            idRoom: room
                            
                        });
                        emitGrid({
                            x: newPlayer.model[i].x,
                            y: newPlayer.model[i].y,
                            color: newPlayer.model[i].color,
                            player: idPlayer,
                            idRoom: room
                            
                        });
                    }
                    }
                }   
                    chatRoomsSemaphore.leave();
                })
            });
            console.log("Enter to room: " + room);
            socket.join(room);

            var frame = 1;
            newPlayer.resetColor();

            var isPressed = false;
            socket.on("pressed",()=>{
                isPressed = true;
            });
            var turn = false;
            socket.on("stopPress",()=>{
                isPressed = false;

            });
            interval = setInterval(() =>{


                if(!pause ){


                    if(isPressed || turn)
                    {
                        turn = false;
                        chatRoomsSemaphore.take(() =>{

                            if(newPlayer.destroy == true)
                            {
                                for(var i = 0; i < newPlayer.destroyGrids.length; i++)
                                {
                                    newPlayer.grid[newPlayer.destroyGrids[i].x][newPlayer.destroyGrids[i].y].color = 0;
                                    const query = `CALL InsertUpdateGrid(?,?,?,?,?,?,?)`;

                                    con.query(query,[room,idPlayer,frame,partida,newPlayer.destroyGrids[i].x,newPlayer.destroyGrids[i].y,newPlayer.destroyGrids[i].color]);
                                    emitGrid({
                                        x: newPlayer.destroyGrids[i].x,
                                        y: newPlayer.destroyGrids[i].y,
                                        color: newPlayer.destroyGrids[i].color,
                                        player: idPlayer,
                                        idRoom: room
                                        
                                    });
                                }
                                newPlayer.move = true;

                                newPlayer.destroy = false;
                                newPlayer.destroyGrids = [];
                                newPlayer.moveDown();
                            }
                            else if (newPlayer.move == true)
                            {
                                for(var i = 0; i < newPlayer.nextMove.length; i++)
                                {
                                    newPlayer.grid[newPlayer.nextMove[i].x][newPlayer.nextMove[i].y].color = newPlayer.nextMove[i].color;

                                    const query = `CALL InsertUpdateGrid(?,?,?,?,?,?,?)`;

                                    con.query(query,[room,idPlayer,frame,partida,newPlayer.nextMove[i].x,newPlayer.nextMove[i].y,newPlayer.nextMove[i].color]);

                                    emitGrid({
                                        x: newPlayer.nextMove[i].x,
                                        y: newPlayer.nextMove[i].y,
                                        color: newPlayer.nextMove[i].color,
                                        player: idPlayer,
                                        idRoom: room
                                        
                                    });
                                }
                                newPlayer.nextMove = [];

                                newPlayer.move = false;
                            }
                            else if(newPlayer.model[2].y+1 != 12)
                            {
                            newPlayer.destroyGrids = [];
                            newPlayer.nextMove = [];

                            if(newPlayer.grid[newPlayer.model[2].x][newPlayer.model[2].y+1].color == 0)
                            {
                                if(newPlayer.model[0].y >= 0)
                                {
                                    const query = `CALL InsertUpdateGrid(?,?,?,?,?,?,?)`;

                                    con.query(query,[room,idPlayer,frame,partida,newPlayer.model[0].x,newPlayer.model[0].y,0]);
                                emitGrid({
                                    x: newPlayer.model[0].x,
                                    y: newPlayer.model[0].y,
                                    color: 0,
                                    player: idPlayer,
                                    idRoom: room
                                    
                                });

                                }
                            }
                            }

                            newPlayer.moveModel(0,1);

                        for(var i = 0; i <3;i++)
                            {
                                if(newPlayer.model[i].y >=0)
                                {
                                    const query = `CALL InsertUpdateGrid(?,?,?,?,?,?,?)`;

                                    con.query(query,[room,idPlayer,frame,partida,newPlayer.model[i].x,newPlayer.model[i].y,newPlayer.model[i].color]);

                                    emitGrid({
                                        x: newPlayer.model[i].x,
                                        y: newPlayer.model[i].y,
                                        color: newPlayer.model[i].color,
                                        player: idPlayer,
                                        idRoom: room
                                        
                                    });
    
                                }
    
                            }
                            
                            chatRoomsSemaphore.leave();
                        });
                    }
                    else{
                        turn = true;
                    }

                                        frame += 1;

                    }
            
                    if(newPlayer.end == true)
                    {
                        newPlayer.end = false;
                        clearInterval(interval);
                        socket.emit("endGame");
                        const query = `CALL MovePlayerInRooms(?,?)`;

                        con.query(query,[null,idPlayer]);
                    }

            }, 250);
        
            socket.on("exitRoom", () => {

                const query = `CALL MovePlayerInRooms(?,?)`;

                con.query(query,[null,idPlayer]);

                clearInterval(interval);

            });
        });



        io.emit("chatRoomsList", chatRooms);
    };


io.on("connection", (socket) => {

socket.on("getPlayers",(id)=>{

    const query3 = `CALL GetAllPlayersInRoom(?)`;


    con.query(query3, [id],function (err, result, fields) {
        console.log(result[0]);

       io.emit("playersInRoom", result[0]);

    });

});

        console.log(chatRooms);

    var address = socket.request.connection;
    console.log("Socket connected with IP" + address.remoteAddress + ":" + address.remotePort);

    //socket.emit("all chat messages", messages);



    socket.on("getRooms",()=>{
        socket.emit("rooms", chatRooms);
    });
    

    socket.on("createRoom", () => {

        chatRoomsSemaphore.take(() =>{
            console.log("Create new room");

         const query = `CALL CreateRoom()`;

         con.query(query);

         const query3 = `CALL GetLastRoomIP()`;
            
         con.query(query3, function (err, result, fields) {
            console.log(result[0][0].idRoom);

            io.emit("clientRoomCreated", result[0][0].idRoom);

            chatRooms.push(result[0][0].idRoom.toString());
                     console.log(chatRooms);

                        io.emit("chatRoomsList", chatRooms);

         });



            chatRoomsSemaphore.leave();
        })

        
    });






        socket.on("emitReplay",(replay1, frame1, player1, room1) =>{
        
            var nextFrame = frame1;

            var end = 0;
            var interval; 

            socket.on("endReplay",()=>{
                clearInterval(interval);  

            });
            
             interval = setInterval(() =>{
                console.log("Frame" + nextFrame);

            
                const query = `CALL GetRep(?,?,?,?)`;
            
                con.query(query, [player1,room1,replay1,nextFrame],function (err, result, fields) {
                    if (err)throw err;

                    if (result[0].toString() != "") {
                        console.log(result[0]);

                        socket.emit("replay",result[0]);
                        end = 0;

                    } else {
                        if(end == 5)
                        {
                                            console.log("finish");
                        clearInterval(interval);  
                        }
                        else{
                            end++;
                        }
      
                    }
                    });
            
            
            
                nextFrame += 1;
            }, 250);
        
        
        });
        socket.on("rep", ()=>{

            const query = `Call GetMatchs()`;
                
            con.query(query, function (err, result, fields) {
                if (err)throw err;

                if (result.toString() != "") {
                    console.log(result[0]);

                    socket.emit("getRep",result[0]);
                } else {
                    console.log("noRep");
                }
                });

        });
        socket.on("createAccount", function(user, password){

            if(user != ''&& password != '')
            {

            
            const query = `CALL ExistUser(?,?)`;
            
            con.query(query, [user,password],function (err, result, fields) {
                if (err)throw err;
    
                if (result[0].toString() != "") {
                    console.log(result[0]);

                    console.log("exist");

        

                } else {
            
                    const query2 = `CALL CreateNewUser(?,?)`;
            
                    con.query(query2,[user,password]);  
                    
                    const query3 = `CALL GetLastUserIP()`;
            
                    con.query(query3,function (err, result, fields) {

                        console.log(result[0][0]);
                    connectPlayer(result[0][0].idUser,socket,user);
                    });
                }
                });
            }
            else{
                console.log("null");

            }
        
        
            });
    socket.on("sign", function(user, password){

        const query = `CALL ExistUser(?,?)`;
            
        con.query(query, [user,password], function(err, result, fields) {
            if (err)throw err;

            if (result[0].toString() != "") {

                if((players.findIndex(x => x.id === result[0].idUser,socket)) == -1 )
                {                        
                connectPlayer(result[0][0].idUser,socket,user);

                }
                else{
                    console.log("esta conectado");

                }


                
            } else {
                console.log("no exist");

            }
            });

    });
});

module.exports = router;