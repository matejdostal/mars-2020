const WEB_SOCKET_SERVER_URL = "ws://localhost:9030";

let socket = null;

const openConnection = (url = WEB_SOCKET_SERVER_URL) => {
  socket = new WebSocket(url);
  socket.onopen = onOpen;
  socket.onclose = onClose;
  socket.onmessage = onMessage;
  socket.onError = onError;
};

const closeConnection = () => {
  socket.close();
  socket = null;
};

const sendMessage = message => {
  socket.send(message);
};

const onOpen = event => { };

const onClose = event => { };

const onMessage = event => {
  const message = event.data;
  console.log(message);
};

const onError = event => {
  console.error(error);
};

openConnection();
