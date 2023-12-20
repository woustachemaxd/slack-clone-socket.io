const socket = io("http://localhost:9000");
const user = prompt("enter your name");
let nsSocket;
socket.on("nsList", (fetchedNamespaces) => {
  //list all the namespaces here
  let namespaceUl = document.getElementById("namespaces");
  namespaceUl.innerHTML = "";
  for (let namespace of fetchedNamespaces) {
    namespaceUl.innerHTML += `<li class="namespaceItems" ns=${namespace.endpoint}>${namespace.nsTitle}</li>`;
  }
  //function to setup joining Namespaces
  Array.from(document.getElementsByClassName("namespaceItems")).forEach(
    (element) => {
      element.addEventListener("click", (event) => {
        // console.log(event.target.getAttribute("ns"));
        joinNs(event.target.getAttribute("ns"));
      });
    }
  );
  //default join first namespace
  let currentNamespace = document
    .querySelector(".namespaceItems")
    .getAttribute("ns");
  joinNs(currentNamespace);
});

const inputBar = document.getElementById("message");
const sendButton = document.getElementById("send-message");

sendButton.addEventListener("click", () => {
  const message = inputBar.value;
  console.log("clicked" + message);
  nsSocket.emit("messageFromUser",message, user );
  inputBar.value = "";
});
