var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var continueListening = false;
var inter = null;

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on("startListen", function(data){
    inter = setInterval(function(){ 
      console.log("Hello");
      var src = data.src;
      var dest = data.dest;
      console.log(src);
      console.log(dest);

      var fs = require("fs");
        var moveFile = function(fileName, src, dest){
          var oldPath = src + "/" + fileName;
          var newPath = dest + "/" + fileName;


          console.log("---");
          console.log(oldPath);
          console.log(newPath);
          console.log(fileName);
          fs.rename(oldPath, newPath, function (err) {
              if (err) {
                  console.log(err);
              } else {
                 console.log("moved the file to -> " + newPath);
              }
          });
      };

      var moveFileAndChange = function(fileName, src, dest){
             var extIndex = fileName.lastIndexOf(".");
            var newName = fileName.substring(0,extIndex) + "_" + (new Date()).getTime() + fileName.substring(extIndex);
            console.log("new name : " + newName);
          var oldPath = src + "/" + fileName;
          var newPath = dest + "/" + newName;


          console.log("---");
          console.log(oldPath);
          console.log(newPath);
          console.log(fileName);
          fs.rename(oldPath, newPath, function (err) {
              if (err) {
                  console.log(err);
              } else {
                
                 console.log("moved the file to -> " + newPath);
              }
          });
      };


      fs.readdir(src, function(err, file) {
        console.log(file);
        for (var i=0; i<file.length; i++) {
          console.log(file[i]);
          if (file[i].indexOf(".txt") > -1) {
            // handel txt
            console.log("txtfound");
            moveFile(file[i],src, dest);
          } 
          else {
            // hansel the rest
         
            moveFileAndChange(file[i], src, dest);
          }
        }

      })

     }, 1000);
  });

  socket.on("stopListen", function(data){
    //continueListening = false;
    if(inter != null){
      console.log("stop");
       clearInterval(inter);
       inter = null;
    }
  });
});
