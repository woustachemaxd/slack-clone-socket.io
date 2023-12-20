//package import
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

//file import
let importedNamespaces = require("./data/namespaces");

const app = express();
app.use(express.static(__dirname + "/public"));
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connect", (socket) => {
  socket.emit("nsList", importedNamespaces);
});

importedNamespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connect", (nsSocket) => {
    nsSocket.emit(
      "roomsList",
      namespace.rooms.map((room) => {
        return {
          roomTitle: room.roomTitle,
          roomId: room.roomId,
          namespace: room.namespace,
        };
      })
    );

    //joinRoom request comes from the socket not the namespace
    nsSocket.on("joinRoom", async (fetchedRoomName) => {
      //everytime the user joins a room they need to leave the last room they were in
      //leave room
      //what room are they in
      const initRoom = [...nsSocket.rooms][1];
      if (initRoom != undefined) {
        nsSocket.leave(initRoom);
        const countInRoom = await io
          .of(namespace.endpoint)
          .in(initRoom)
          .fetchSockets();
        io.of(namespace.endpoint)
          .in(initRoom)
          .emit("updateCount", countInRoom.length);
      }
      nsSocket.join(fetchedRoomName.roomName);
      const selectedRoom = namespace.rooms.find((room) => {
        return room.roomTitle == fetchedRoomName.roomName;
      });
      //count of users in the current room
      const countInRoom = await io
        .of(namespace.endpoint)
        .in(fetchedRoomName.roomName)
        .fetchSockets();
      //send the updated count to the room
      io.of(namespace.endpoint)
        .in(fetchedRoomName.roomName)
        .emit("updateCount", countInRoom.length);
      //sending the history back to the socket which just joined
      nsSocket.emit("updateHistory", selectedRoom.history);
    });
    //when a user sends a text in the Room
    nsSocket.on("messageFromUser", (message, user) => {
      const roomNameTheMessageCameFrom = [...nsSocket.rooms][1];
      const selectedRoom = namespace.rooms.find((room) => {
        return room.roomTitle == roomNameTheMessageCameFrom.trim();
      });
      //message added to room history
      selectedRoom.addMessage(`${user}: ${message}`);
      //sending updated chat to everyone in the room
      io.of(namespace.endpoint)
        .to(roomNameTheMessageCameFrom)
        .emit("updateHistory", selectedRoom.history);
    });
  });
});

httpServer.listen(9000);
