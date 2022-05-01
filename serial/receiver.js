var SerialPort = require("serialport");
const serialConfig = require("../setup/serialcommands.json");
const Readline = require("@serialport/parser-readline");

const { port, baudRate, dataBits, stopBits } = serialConfig.serialConfig;

var serialPort = new SerialPort(port, {
  baudRate: 9600,
});

//parse serial data
const readSerialData = () => {
  const parser = new Readline();
  port.pipe(parser);

  serialPort.on("open", function () {
    console.log("-- Connection opened --");
    parser.on("data", function (data) {
      console.log("Data received: " + data);
    });
  });
};

module.exports = readSerialData;
