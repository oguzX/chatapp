const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const webpack = require('webpack');

const PORT = 3000;
app.use(express.static("public"));

const activeUsers = new Set();


io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('new user', (data) =>{
        console.log(data)
        socket.userId = data;
        activeUsers.add(data);
        io.emit('new user', [...activeUsers]);
    });
    
    socket.on('disconnect', () =>{
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
    });

    socket.on('chat message', (msg) => {
        console.log(msg)
        let date = new Date();
        if(msg.user === '' || msg.user === undefined){
            msg.user = 'noname';
        }
        io.emit('chat message', `${msg.user} : ${msg.message} ${date.getUTCHours()}:${date.getUTCMinutes()}`);
    });

    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", data);
    });

    socket.on('username change', (user) => {
        if(!!user.username){
            username = `Noname${Math.floor(Math.random() * 1000000)}`;
        }

        activeUsers.delete(socket.userId);
        socket.userId = user.username;
        activeUsers.add(user.username);
        console.log(activeUsers)
        io.emit('new user', [...activeUsers]);
    });
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});