// var SerialPort = require("serialport").SerialPort;
// const serialConfig = require("../../config/serialcommands.json");
// const { ReadlineParser } = require("@serialport/parser-readline");

// const { port, baudRate, dataBits, stopBits } = serialConfig.serialConfig;

// var serialPort = new SerialPort({
//   path: port,
//   baudRate: baudRate
// });

// //parse serial data
// const readSerialData = () => {
//   const parser = new ReadlineParser({ delimiter: "\r\n" });
//   port.pipe(parser);

//   serialPort.on("open", function () {
//     new Promise((resolve, reject) => {
//       console.log("-- Connection opened --");
//       parser.on("data", function (data) {
//         console.log("Data received: " + data);

//         resolve(data);
//         reject({ error: err });
//       });
//     });
//   });
// };

// module.exports = readSerialData;
