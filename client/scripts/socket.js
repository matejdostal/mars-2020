const WEB_SOCKET_SERVER_URL = "ws://localhost:9030";

const state = {
    rover: {
        x: null,
        y: null,
        rotation: null
    },
    points: []
};

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
    // console.log('NOW');
};

const onClose = event => {

};

const onMessage = event => {
    const message = event.data;
    const data = JSON.parse(message);
    points.push([data.x, -data.y]);
    console.log("HANDLE DATA: %j", data);
};

const onError = event => {
    console.error(error);
};

openConnection();
