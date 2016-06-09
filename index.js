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
  if (NumConnected === 1) {
    console.log('Waiting for another player...');
  } else if (NumConnected === 2) {
    console.log("Awesome, let's begin playing!");
  } else if (NumConnected > 2) {
    console.log("Too many players online!");
    console.log("My goodness, I haven't the slightest idea what to do.");
  } else {
    console.log("Sorry, something's wrong with the connection.");
    console.log("Try refreshing the page.");
  }
  socket.on('disconnect', function(){
    NumConnected--;
    console.log('user disconnected');
    console.log(NumConnected + ' people connected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
