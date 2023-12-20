const joinNs = (endpoint) => {
  nsSocket = io("http://localhost:9000" + endpoint);
  nsSocket.on("roomsList", (roomsList) => {
    const roomsUl = document.getElementById("roomlist");
    roomsUl.innerHTML = "";
    for (let room of roomsList) {
      roomsUl.innerHTML += `<li class="roomItems"> ${room.roomTitle} </li>`;
    }
    //setup what happens when you click on a room (you run joinRoom(roomName))
    Array.from(document.getElementsByClassName("roomItems")).forEach(
      (element) => {
        element.addEventListener("click", (event) => {
          console.log("Room clicked:", event.target.innerText);
          joinRoom(event.target.innerText);
        });
      }
    );
    //join the first room by default
    let currentRoom = document.querySelector(".roomItems").innerText;
    joinRoom(currentRoom);
  });
};
