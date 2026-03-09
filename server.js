const { Server } = require("socket.io");

const io = new Server(3000,{
  cors:{origin:"*"}
});

let players = {};

io.on("connection",socket=>{

 socket.on("join",data=>{

   players[socket.id] = {
     room:data.room,
     x:0,
     y:0,
     speaking:false
   };

   socket.join(data.room);

   socket.to(data.room).emit("playerJoin",socket.id);

 });

 socket.on("position",pos=>{

   if(players[socket.id]){
     players[socket.id].x = pos.x;
     players[socket.id].y = pos.y;
   }

 });

 socket.on("speaking",state=>{

   if(players[socket.id]){
     players[socket.id].speaking = state;
     socket.to(players[socket.id].room)
       .emit("speaking",{id:socket.id,state:state});
   }

 });

 socket.on("signal",data=>{
   io.to(data.target).emit("signal",{
     sender:socket.id,
     data:data.data
   });
 });

 socket.on("disconnect",()=>{
   delete players[socket.id];
 });

});
