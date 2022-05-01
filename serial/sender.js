const SerialPort = require("serialport");
const serialConfig = require("../setup/serialcommands.json");

const { port, baudRate, dataBits, stopBits } = serialConfig.serialConfig;

var serialPort = new SerialPort({
  baudRate: baudRate,
  path: port,
});

const writeToSerial = (message) => {
  serialPort.write(message, function (err) {
    if (err) {
      return console.log("Error on write: ", err.message);
    }
    console.log("Message sent successfully");
  });
};

module.exports = writeToSerial;
