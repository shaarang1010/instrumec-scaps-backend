const SerialPort = require("serialport").SerialPort;
const serialConfig = require("../setup/serialcommands.json");
const { ReadlineParser } = require("@serialport/parser-readline");
const { serialDataFormatters, matchExpectations } = require("../middleware/helpers/serialDataFormatters");

const { port, baudRate, dataBits, stopBits } = serialConfig.serialConfig;

var serialPort = new SerialPort({
  baudRate: baudRate,
  path: port
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

const readSerialData = (expectedResponse) => {
  const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));
  //console.log(parser);

  serialPort.on("open", function () {
    console.log("-- Connection opened --");
  });
  serialPort.on("data", function (data) {
    console.log(data.toString());
    console.log("Data received: " + data);
    const isMatchExpectation = matchExpectations(data, expectedResponse);
    new Promise((resolve, reject) => {
      resolve({ data: data, repsonseMatch: isMatchExpectation });
      reject({ error: err });
    });
  });
};

module.exports = { writeToSerial, readSerialData };
