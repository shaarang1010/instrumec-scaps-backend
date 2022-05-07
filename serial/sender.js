const SerialPort = require("serialport").SerialPort;
const serialConfig = require("../setup/serialcommands.json");
const { ReadlineParser } = require("@serialport/parser-readline");
const serialDataFormatters = require("../middleware/helpers/serialDataFormatters");

const { port, baudRate, dataBits, stopBits } = serialConfig.serialConfig;

var serialPort = new SerialPort({
  baudRate: baudRate,
  path: port
});

const writeToSerial = (message) => {
  const dat = serialDataFormatters("test");
  serialPort.write(dat, function (err) {
    if (err) {
      return console.log("Error on write: ", err.message);
    }
    console.log("Message sent successfully");
    // new Promise((resolve, reject) => {
    //   resolve("sent message"); // put more useful data to be resolved
    //   reject({ error: err });
    // });
  });
};

const readSerialData = () => {
  const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));
  //console.log(parser);

  serialPort.on("open", function () {
    console.log("-- Connection opened --");
  });
  serialPort.on("data", function (data) {
    console.log(data);
    console.log("Data received: " + data);
    // new Promise((resolve, reject) => {
    //   resolve(data);
    //   reject({ error: err });
    // });
  });
};

module.exports = { writeToSerial, readSerialData };
