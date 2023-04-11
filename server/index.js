const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const io = new Server({ cors: true });
const app = express();

app.use(bodyParser.json());

const emailIdSocketPair = new Map();
const socketToEmailMapping = new Map();

io.on("connection", function (socket) {
  // enter to room
  socket.on("enter-room", function (data) {
    const { roomId, emailId } = data;
    emailIdSocketPair.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);
    socket.join(roomId);
    socket.emit("entered-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });
  // calls to user
  socket.on("call-user", function (data) {
    const { emailId, offer } = data;
    const fromEmail = socketToEmailMapping.get(socket.id);
    const socketId = emailIdSocketPair.get(emailId);
    socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
  });
  // answers to call
  socket.on("call-accepted", function (data) {
    const { emailId, answer } = data;
    const socketId = emailIdSocketPair.get(emailId);
    socket.to(socketId).emit("call-accepted", { answer });
  });
});

app.listen(5000, function () {
  console.log("Server is running");
});
io.listen(5001);
