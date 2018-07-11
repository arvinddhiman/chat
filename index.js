const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'dist/chat'), { redirect: false }));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/chat/index.html'));
});

var server = app.listen(port, function () {
    console.log('Server started on port '+ port);
});

var io = require('socket.io').listen(server);


io.on('connection', function (socket) {

    console.log('new connection made.');

    socket.on('join', function(data){
        //joining
        socket.join(data.room);

        console.log(data.user + 'joined the room : ' + data.room);

        socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has joined this room.'});
    });


    socket.on('leave', function(data){

        console.log(data.user + 'left the room : ' + data.room);

        socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

        socket.leave(data.room);
    });

    socket.on('message',function(data){

        io.in(data.room).emit('new message', {user:data.user, message:data.message});
    });
});