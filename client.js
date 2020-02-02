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

const onOpen = event => {};

const onClose = event => {};

const onMessage = event => {
  const message = event.data;
  // console.log(message);
  createPoint(message);
};

const onError = event => {
  console.error(error);
};

const createPoint = point => {
  let divEl = document.createElement("div");
  point = JSON.parse(point);
  divEl.classList.add("point");
  divEl.style.left = point.x * 500 + window.outerWidth / 2;
  divEl.style.bottom = point.y * 500;
  document.body.appendChild(divEl);
};

openConnection();
