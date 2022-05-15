const SerialPort = require("serialport").SerialPort;
const serialConfig = require("../setup/serialcommands.json");
const { ReadlineParser } = require("@serialport/parser-readline");
const { serialDataFormatters, matchExpectations } = require("../middleware/helpers/serialDataFormatters");
const { setHopperCount, formatHopperCount } = require("../middleware/helpers/hopperMapper");
const { setToCache, getFromCache } = require("../middleware/helpers/cacheCommands");

const { port, baudRate, dataBits, stopBits } = serialConfig.serialConfig;

const serialPort = new SerialPort({
  baudRate: baudRate,
  path: port
});

const writeToSerial = (message) => {
  return new Promise((resolve, reject) => {
    serialPort.write(message, function (err) {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log("Message sent successfully");

      resolve("serial message: == ", message); // put more useful data to be resolved
      reject({ error: err });
    });
  });
};

const readSerialData = (expectedResponse, saveMagzineCount = false) => {
  const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));
  //console.log(parser);

  serialPort.once("open", function () {
    console.log("-- Connection opened --");
  });
  return new Promise((resolve, reject) => {
    serialPort.once("data", function async(data) {
      console.log(data.toString());
      console.log("Data received: " + data);
      if (saveMagzineCount) {
        const hopperCount = setHopperCount(data.toString());
        const cache = setToCache("hopperCount", formatHopperCount(hopperCount));
        return hopperCount;
      }
      const isMatchExpectation = matchExpectations(data.toString(), expectedResponse);
      resolve({ data: data.toString(), repsonseMatch: isMatchExpectation });
      reject({ error: `Error === ${data.toString()}` });
    });
  });
};

module.exports = { writeToSerial, readSerialData };
