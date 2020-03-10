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

const onOpen = event => {
    const statusEl = document.querySelector('#status-span');
    statusEl.classList.remove('disconnected');
    statusEl.classList.add('connected');
    statusEl.innerHTML = "Connected";
};

const onClose = event => {
    const statusEl = document.querySelector('#status-span');
    statusEl.classList.add('disconnected');
    statusEl.classList.remove('connected');
    statusEl.innerHTML = "Disconnected";
};

const onMessage = event => {
    const message = event.data;
    var data;
    try {
        data = JSON.parse(message);
    } catch (e) {
        data = message;
    }
    console.log("HANDLE DATA: %j", data);
};

const onError = event => {
    console.error(error);
};

openConnection();
