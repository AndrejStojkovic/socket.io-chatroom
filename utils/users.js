const users = [];
var roomCount = [];

var x = 0;

// Join user to chat
function userJoin(id, username, room, color) {
  const user = { id, username, room, color };

  users.push(user);

  if(roomCount[room] == undefined) roomCount[room] = 1;
  else roomCount[room]++;

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const user = users.find(user => user.id === id);

  if(user != null) roomCount[user.room]--;

  const index = users.findIndex(user => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

// Get user count from room
function getRoomUserCount(room) {
  return roomCount[room];
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getRoomUserCount
};