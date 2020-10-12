var socket = io();
var title = 'Chat Room |';
document.title = title + ' Home';

// Disable Redirect
document.getElementById('playForm').addEventListener('submit', function(e) { e.preventDefault(); return false; });
//document.querySelector('button').addEventListener('click', function(e) { e.preventDefault(); return false; });

// Chat Button for Minimize/Maximize
var chatUp = true;

/*
document.getElementsByClassName('state-button')[0].addEventListener('click', function() {
    if(chatUp) {
        document.getElementsByClassName('chatWindow')[0].style.display = 'none';
        document.getElementsByClassName('chatInput')[0].style.display = 'none';
        document.getElementsByName('chevron')[0].classList.remove('fa-chevron-down');
        document.getElementsByName('chevron')[0].classList.add('fa-chevron-up');

        chatUp = false;
    } else {
        document.getElementsByClassName('chatWindow')[0].style.display = 'block';
        document.getElementsByClassName('chatInput')[0].style.display = 'block';
        document.getElementsByName('chevron')[0].classList.remove('fa-chevron-up');
        document.getElementsByName('chevron')[0].classList.add('fa-chevron-down');

        chatUp = true;
    }
});*/

// Play Button Event
document.getElementById('chatButton').addEventListener('click', function() {
    var username = document.getElementById('usernameField').value;
    var roomCode = document.getElementById('roomCodeField').value;

    if(roomCode == '') for(var i = 0; i < 5; i++) roomCode += getRandomInt(0, 9);
    
    //roomCode = Math.floor(Math.random() * 0xFFFFF).toString(16);

    socket.emit('joinRoom', { username, roomCode }); 

    document.getElementsByClassName('startScreen')[0].style.display = 'none';
    document.getElementsByClassName('mainChat')[0].style.display = 'block';
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Chat Input
document.getElementById('chatForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var chatInput = document.getElementById('chatText').value;

    if(chatInput == '') return false;
    socket.emit('chatMessage', chatInput);
    document.getElementById('chatText').value = '';
});

// Send Message/s
socket.on('message', msg => {
    const pElement = document.createElement('p');
    pElement.innerHTML = '<strong><span class=\"user\" style=\"color: ' + msg.color + ';\">' + msg.username + '</span></strong>: ' + msg.text;
    document.getElementById('messages').appendChild(pElement);
});

socket.on('messageInOut', msg => {
    const pElement = document.createElement('p');
    pElement.classList.add('is-online');
    pElement.innerHTML = msg;
    document.getElementById('messages').appendChild(pElement);
});

// Set Room Code
socket.on('userRoom', room => {
    document.getElementsByClassName('roomCode')[0].innerHTML = room;
    document.title = title + ' Room ' + room;
});

// Set User Count
socket.on('userCount', count => {
    if(count > 1) document.getElementsByClassName('userNum')[0].innerHTML = count + ' users';
    else document.getElementsByClassName('userNum')[0].innerHTML = count + ' user';
});

// Set User List
socket.on('userList', users => {
    var usernames = [];
    for(var i = 0; i < users.length; i++) { usernames.push(users[i].username); }
    document.getElementsByClassName('userNames')[0].innerHTML = '';

    usernames.sort();
    for(var i = 0; i < usernames.length; i++) {
        if(i != (usernames.length - 1)) document.getElementsByClassName('userNames')[0].innerHTML += usernames[i] + '<br>';
        else document.getElementsByClassName('userNames')[0].innerHTML += usernames[i];
    }      
});