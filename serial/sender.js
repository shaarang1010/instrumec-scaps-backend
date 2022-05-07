const SerialPort = require("serialport").SerialPort;
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
    new Promise((resolve, reject) => {
      resolve("sent message"); // put more useful data to be resolved
      reject({ error: err });
    });
  });
};

module.exports = writeToSerial;
