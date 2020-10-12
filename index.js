const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8080;

const formatMessage = require('./utils/messages');
const getRandomUsername = require('./utils/randomUsername');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getRoomUserCount } = require('./utils/users');
const colors = ['#E74C3C', '#EA4C88', '#8E44AD', '#0287D0', '#27CBC0', '#2ECC71', '#F1892D', '#7C8A99', '#FF00CC'];

app.get('/', function(req, res) { res.sendFile(path.join(__dirname + '/public/index.html')); });

app.use('/public', express.static(__dirname + '/public'));

io.sockets.on('connection', socket => {
    socket.on('joinRoom', ({username, roomCode}) => {
        var color = colors[Math.floor(Math.random() * colors.length).toString(16)];
        if(username == '') username = getRandomUsername();
        const user = userJoin(socket.id, username, roomCode, color);

        socket.join(user.room);

        io.to(user.room).emit('messageInOut',
            '🟢<i><span class=\"user\" style=\"color: ' + user.color + ';\">' + user.username + '</span> joined the chat...</i>'
        );

        io.to(user.room).emit('userRoom', user.room);
        io.to(user.room).emit('userCount', getRoomUserCount(user.room));
        io.to(user.room).emit('userList', getRoomUsers(user.room));
    });

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg, user.color));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('messageInOut',
                '🔴<i><span class=\"user\" style=\"color: ' + user.color + ';\">' + user.username + '</span> left the chat...</i>'
            );

            io.to(user.room).emit('userCount', getRoomUserCount(user.room));
            io.to(user.room).emit('userList', getRoomUsers(user.room));
        }
    });
});

http.listen(port, () => { console.log(`Server listening on localhost:${port}`); });

process.on('SIGTERM', () => { process.exit(1); });