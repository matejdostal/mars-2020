const WebSocket = require("ws");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const fs = require("fs");
const path = require("path");

//==================================================================================

const WEBSOCKET_PORT = 9030;
const BLUETOOTH_ADDRESS = "98:D3:91:FD:3A:4B";

//==================================================================================

const sockets = {};
let counter = 0;

let server = new WebSocket.Server({
    port: WEBSOCKET_PORT
});

server.on("listening", () => {
    console.log("WEBSOCKET SERVER LISTENING ON PORT %d", WEBSOCKET_PORT);
    // initBluetoothDevice();
});

server.on("close", () => {
    console.log("WEBSOCKET SERVER CLOSED");
});

server.on("connection", socket => {
    const id = ++counter;
    sockets[id] = socket;
    console.log("CLIENT (%d) CONNECTED TO WEBSOCKET SERVER", id);

    // TEST -------------------------------------------------------------------------
    let dataList = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));
    const sendData = () => {
        const data = dataList.shift();
        broadcastMessage(JSON.stringify(data));
        if (dataList && dataList.length) {
            setTimeout(sendData, 100);
        }
    };
    if (dataList && dataList.length) sendData();
    // TEST -------------------------------------------------------------------------

    socket.on("close", () => {
        delete sockets[id];
        console.log("CLIENT (%d) DISCONNECTED FROM WEBSOCKET SERVER", id);
    });

    socket.on("message", message => {
        console.log("CLIENT (%d) SENT MESSAGE: %s", id, message);
        broadcastMessage("RE: " + message);
    });

    socket.on("error", error => {
        console.log("SOCKET ERROR: %s", error);
    });
});

server.on("error", error => {
    console.log("WEBSOCKET SERVER ERROR: %s", error);
});

const sendMessage = (id, message) => {
    const socket = sockets[id];
    if (socket) {
        socket.send(message);
    }
};

const broadcastMessage = message => {
    Object.keys(sockets).forEach(id => {
        sendMessage(id, message);
    });
};

//==================================================================================

const computeX = (distance, angle) => Math.cos(angle) * distance;
const computeY = (distance, angle) => Math.sin(angle) * distance;

const computeXY = (distance, angle) => ({
    x: computeX(distance, angle),
    y: computeY(distance, angle)
});

const toFixedValue = (value, precision = 2) => Math.round(value * 10 ** precision) / 10 ** precision;

//==================================================================================

const connectBluetoothDevice = async bluetoothPortInfo => {
    const port = new SerialPort(bluetoothPortInfo.path, { baudRate: 9600 });
    const parser = new Readline();
    console.log("BLUETOOTH DEVICE CONNECTED");
    port.pipe(parser);
    parser.on("data", data => {
        console.log("DATA RECEIVED FROM BLUETOOTH: %s", data);
        try {
            const [distance, angle] = JSON.parse(data);
            const { x, y } = computeXY(distance / 100, angle * (Math.PI / 180));
            broadcastMessage(
                JSON.stringify({
                    x: toFixedValue(x),
                    y: toFixedValue(y),
                    distance,
                    angle
                })
            );
        } catch (error) {
            console.error(error);
        }
    });
};

const findBluetoothDevice = async bluetoothAddress => {
    console.log("SEARCHING FOR BLUETOOTH DEVICE");
    const portInfoList = await SerialPort.list();
    const bluetoothPortInfo = portInfoList.find(
        portInfo => portInfo.pnpId.indexOf(bluetoothAddress.split(":").join("")) != -1
    );
    if (!bluetoothPortInfo) {
        throw new Error("BLUETOOTH DEVICE NOT FOUND, LET'S SEARCH AGAIN");
    }
    return bluetoothPortInfo;
};

const initBluetoothDevice = () => {
    findBluetoothDevice(BLUETOOTH_ADDRESS)
        .then(connectBluetoothDevice)
        .catch(error => {
            console.error("%s", error);
            setTimeout(initBluetoothDevice, 1000);
        });
};
