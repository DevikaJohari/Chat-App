
const {getUsers, users} = require('./getUsers');

//Socket connection
function socket(io) {
    io.on('connection', (socket) => {

        socket.on('joined-user', (data) =>{
            //Storing users connected in a room in memory
            var user = {};
            user[socket.id] = data.UserName;
            if(users[data.RoomName]){
                users[data.RoomName].push(user);
            }
            else{
                users[data.RoomName] = [user];
            }
            
            //Joining the Socket Room
            socket.join(data.RoomName);
    
            //Emitting New Username to Clients
            io.to(data.RoomName).emit('joined-user', {UserName: data.UserName});
    
            //Send online users array
            io.to(data.RoomName).emit('online-users', getUsers(users[data.RoomName]))
        })
    
        //Emitting messages to Clients
        socket.on('chat', (data) =>{
            io.to(data.RoomName).emit('chat', {UserName: data.UserName, message: data.message});
        })
    
        //Broadcasting the user who is typing
        socket.on('typing', (data) => {
            socket.broadcast.to(data.RoomName).emit('typing', data.UserName)
        })
    
        //Remove user from memory when they disconnect
        socket.on('disconnecting', ()=>{
            var rooms = Object.keys(socket.rooms);
            var socketId = rooms[0];
            var RoomName = rooms[1];
            users[RoomName].forEach((user, index) => {
                if(user[socketId]){
                    users[RoomName].splice(index, 1)
                }
            });
    
            //Send online users array
            io.to(RoomName).emit('online-users', getUsers(users[RoomName]))
        })
    })
}

module.exports = socket;