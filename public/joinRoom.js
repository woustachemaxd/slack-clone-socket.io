const joinRoom = (roomName) => {
  nsSocket.emit("joinRoom", { roomName: roomName });
  const title = document.getElementById("chatbox");
  nsSocket.on("updateCount", (count) => {
    title.innerHTML = `${roomName} of ${count}`;
  });
  nsSocket.on("updateHistory", (fectchedHistory) => {
    const chatUl = document.getElementById("chat-list");
    chatUl.innerHTML = "";
    for (let text of fectchedHistory) {
      chatUl.innerHTML += `<li>${text}</li>`;
    }
  });
};
