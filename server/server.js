const WebSocket = require("ws");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

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
  console.log("SERVER IS LISTENING ON PORT %d", WEBSOCKET_PORT);
});

server.on("close", () => {
  console.log("SERVER CLOSED");
});

server.on("connection", socket => {
  const id = ++counter;
  sockets[id] = socket;
  console.log("CLIENT (%d) CONNECTED TO SERVER", id);

  socket.on("close", () => {
    delete sockets[id];
    console.log("CLIENT (%d) DISCONNECTED FROM SERVER", id);
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
  console.log("SERVER ERROR: %s", error);
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

const toFixedValue = (value, precision = 2) =>
  Math.round(value * 10 ** precision) / 10 ** precision;

//==================================================================================

const connectBluetoothDevice = async bluetoothPortInfo => {
  const port = new SerialPort(bluetoothPortInfo.path, { baudRate: 9600 });
  const parser = new Readline();
  port.pipe(parser);
  parser.on("data", data => {
    console.log(data);
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
  const portInfoList = await SerialPort.list();
  const bluetoothPortInfo = portInfoList.find(
    portInfo =>
      portInfo.pnpId.indexOf(bluetoothAddress.split(":").join("")) != -1
  );
  if (!bluetoothPortInfo) {
    throw new Error("HC-05 Bluetooth device not found");
  } 
  return bluetoothPortInfo;
};

findBluetoothDevice(BLUETOOTH_ADDRESS)
  .then(connectBluetoothDevice)
  .catch(console.error);
