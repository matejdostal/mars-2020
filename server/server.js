const WebSocket = require("ws");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const fs = require("fs");
const path = require("path");
const colors = require('colors');

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
    console.log("WEBSOCKET SERVER LISTENING ON PORT %d".yellow, WEBSOCKET_PORT);
    initBluetoothDevice();
});

server.on("close", () => {
    console.log("WEBSOCKET SERVER CLOSED");
});

server.on("connection", socket => {
    const id = ++counter;
    sockets[id] = socket;
    console.log("CLIENT (%d) CONNECTED TO WEBSOCKET SERVER".yellow, id);

    // TEST -------------------------------------------------------------------------
    // let dataList = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));
    // let timer = null;
    // const sendData = () => {
    //     const data = dataList.shift();
    //     broadcastMessage(JSON.stringify(data));
    //     if (dataList && dataList.length) {
    //         timer = setTimeout(sendData, 1000);
    //     }
    // };
    // if (dataList && dataList.length) sendData();
    // TEST -------------------------------------------------------------------------

    socket.on("close", () => {
        // clearTimeout(timer);
        delete sockets[id];
        console.log("CLIENT (%d) DISCONNECTED FROM WEBSOCKET SERVER".yellow, id);
    });

    socket.on("message", message => {
        console.log("CLIENT (%d) SENT MESSAGE: %s", id, message);
        writeToBluetoothDevice(message);
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

const toFixedValue = (value, precision = 5) => Math.round(value * 10 ** precision) / 10 ** precision;

//==================================================================================

let port = null;
// let findingBluetoothIndex = 1;

// const getEllipsis = () => {
//     let str = '';
//     for (let i = 0; i < findingBluetoothIndex; i++) {
//         str += '.';
//     }
//     return str;
// }

const connectBluetoothDevice = async bluetoothPortInfo => {
    port = new SerialPort(bluetoothPortInfo.path, { baudRate: 9600 }, err => {
        if (err) {
            console.log(`${err}`.red);
            connectBluetoothDevice(bluetoothPortInfo);
        } else {
            console.log('BLUETOOTH CONNECTED'.green);
            const parser = new Readline();
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
        }
        // if (error) {
        //     console.log(error);
        //     // process.stdout.write(`\x1Bc\rSearching for bluetooth device${getEllipsis()}  `.blue);
        //     // findingBluetoothIndex = findingBluetoothIndex < 3 ? ++findingBluetoothIndex : 1;
        //     port = null;
        //     setTimeout(() => connectBluetoothDevice(bluetoothPortInfo), 1000);
        //     return;
        // } else {
        //     const parser = new Readline();
        //     console.log("BLUETOOTH DEVICE CONNECTED".green);
        //     port.pipe(parser);
        //     parser.on("data", data => {
        //         console.log("DATA RECEIVED FROM BLUETOOTH: %s", data);
        //         // try {
        //         //     const [distance, angle] = JSON.parse(data);
        //         //     const { x, y } = computeXY(distance / 100, angle * (Math.PI / 180));
        //         //     broadcastMessage(
        //         //         JSON.stringify({
        //         //             x: toFixedValue(x),
        //         //             y: toFixedValue(y),
        //         //             distance,
        //         //             angle
        //         //         })
        //         //     );
        //         // } catch (error) {
        //         //     console.error(error);
        //         // }
        //     });
        // }
    });
};

const findBluetoothDevice = async bluetoothAddress => {
    console.log("SEARCHING FOR BLUETOOTH DEVICE".blue);
    // process.stdout.write(`\x1Bc\rSearching for bluetooth device.  `.blue);
    const portInfoList = await SerialPort.list();
    const bluetoothPortInfo = portInfoList.find(
        portInfo => portInfo.pnpId.indexOf(bluetoothAddress.split(":").join("")) != -1
    );
    if (!bluetoothPortInfo) {
        console.log('BLUETOOTH DEVICE NOT PAIRED'.red);
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

const writeToBluetoothDevice = message => {
    if (port) port.write(message);
};
