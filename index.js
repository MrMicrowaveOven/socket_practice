var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var NumConnected = 0;

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket){
  NumConnected++;
  console.log('a user connected');
  console.log(NumConnected + ' people connected');
  CheckNumberUsers();
  socket.on('disconnect', function(){
    NumConnected--;
    console.log('user disconnected');
    console.log(NumConnected + ' people connected');
    CheckNumberUsers();
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

var CheckNumberUsers = function(){
  if (NumConnected === 1) {
    io.emit('chat message', 'Waiting for another player...');
  } else if (NumConnected === 2) {
    io.emit('chat message', "Awesome, let's begin playing!");
  } else if (NumConnected > 2) {
    io.emit('chat message', "Too many players online!  " + NumConnected + " total.");
    io.emit('chat message', "My goodness, I haven't the slightest idea what to do.");
  } else {
    io.emit('chat message', "Sorry, something's wrong with the connection.");
    io.emit('chat message', "Try refreshing the page.");
  }
};

http.listen(3000, function(){
  console.log('listening on *:3000');
});
