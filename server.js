const WebSocket = require("ws");
// const bluetooth = require("node-bluetooth");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

const WEBSOCKET_PORT = 9030;

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

// const randomDistance = () => Math.random() * 10;
// const randomAngle = () => Math.random() * 180;

const computeX = (distance, angle) => Math.cos(angle) * distance;
const computeY = (distance, angle) => Math.sin(angle) * distance;

const computeXY = (distance, angle) => ({
  x: computeX(distance, angle),
  y: computeY(distance, angle)
});

const toFixedValue = (value, precision = 2) =>
  Math.round(value * 10 ** precision) / 10 ** precision;

// setInterval(() => {
//   try {
//     const distance = randomDistance();
//     const angle = randomAngle();
//     const x = computeX(distance, angle);
//     const y = computeY(distance, angle);
//     const data = {
//       distance: toFixedValue(distance),
//       angle: toFixedValue(angle),
//       x: toFixedValue(x),
//       y: toFixedValue(y)
//     };
//     console.log(data);
//     broadcastMessage(JSON.stringify(data));
//   } catch (error) {
//     console.error(error);
//   }
// }, 200);

//==================================================================================

// const TARGET_DEVICE_ADDRESS = "98:D3:91:FD:3A:4B";

// const device = new bluetooth.DeviceINQ();

// device.listPairedDevices(pairedDevices => {
//   pairedDevices.forEach(pairedDevice => {
//     if (pairedDevice.address === TARGET_DEVICE_ADDRESS) {
//       const { address, services } = pairedDevice;
//       const channel = services[0].channel;
//       bluetooth.connect(address, channel, (error, connection) => {
//         if (error) {
//           console.error(error);
//           return;
//         }
//         connection.on("data", buffer => {
//           processBuffer(buffer);
//         });
//       });
//     }
//   });
// });

// let textBuffer = ""; //first in first out
// const processBuffer = buffer => {
//   textBuffer += buffer.toString();
//   while (textBuffer.indexOf("]") != -1) {
//     const index = textBuffer.indexOf("]");
//     const data = textBuffer.substr(0, index + 1);
//     textBuffer = textBuffer.substr(index + 1);
//     console.log(data);
//     try {
//       const [distance, angle] = JSON.parse(data);
//       const { x, y } = computeXY(distance / 100, angle * (Math.PI / 180));
//       broadcastMessage(
//         JSON.stringify({
//           x: toFixedValue(x),
//           y: toFixedValue(y),
//           distance,
//           angle
//         })
//       );
//     } catch (error) {}
//   }
// };

//================================================================

const path = "COM11";
const port = new SerialPort(path, { baudRate: 256000 });

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
  } catch (error) { }
});
