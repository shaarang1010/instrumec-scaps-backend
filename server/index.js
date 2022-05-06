// Include Nodejs' net module.
const Net = require("net");
const os = require("os");
const serialDataFormatters = require("../middleware/helpers/serialDataFormatters");
const {
  testScapsCommands,
  updateScapsTemplate,
} = require("../middleware/requestshandlers");
// The port on which the server is listening.
const port = 5050;
//Get ip address
const ipAddress = os.networkInterfaces()["Wi-Fi"][1].address;
// import request handler
const requestHandler = require("../middleware/requestshandlers");
const {
  testConnection,
  isMarking,
  loadEntityDataToTemplate,
  markEntityByName,
} = require("../middleware/scapsCommands");

//import serial handlers
const { writeToSerial, readSerialData } = require("../serial");
const { serialCommands } = require("../setup/serialcommands.json");

// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
let server = Net.createServer(function (connection) {
  console.log("client connected");

  connection.on("data", async function (data) {
    switch (data.toString()) {
      case "TEST":
        let scapCommand = testConnection(
          "Communication with Instrumec Scrittore is up.."
        ).toString();
        console.log(scapCommand);
        let returnValue1 = await testScapsCommands(scapCommand);
        console.log(returnValue1);
        break;
      case "MIDDLEWARE":
        console.log("working....");
        break;
      case "ISMARKING":
        let returnValue2 = await testScapsCommands(isMarking());
        console.log(returnValue2);
        break;
      case "PRINTJOB":
        let returnValue = await testScapsCommands(markEntityByName("", true));
        console.log(returnValue);
        break;
      case "REBOOT":
        let rebootMessage = serialDataFormatters(serialCommands.reboot);
        let reboot = await writeToSerial(rebootMessage);
        console.log(reboot);
        break;
      case "ACTIVATE_LASER":
        let message = serialDataFormatters(serialCommands.activateLaser, 1);
        const activateLaser = await writeToSerial(message);
        console.log(activateLaser);
        break;
      case "RESCAN":
        let carouselRescanMessage = serialDataFormatters(
          serialCommands.carouselRescan
        );
        const rescan = await writeToSerial(carouselRescanMessage);
        console.log(rescan);
        break;
      case "SET_POS":
        let currentPosMessage = serialDataFormatters(
          serialCommands.setCurrentPos
        );
        const setCurrentPos = await writeToSerial(currentPosMessage);
        console.log(setCurrentPos);
        break;
      default:
        let patientData = await requestHandler.processData(data.toString());

        let setOfInstructions = [
          loadEntityDataToTemplate("hopperNumber", patientData.hopper),
          loadEntityDataToTemplate("patientName", patientData.patientName),
          loadEntityDataToTemplate("specimen", patientData.specimen),
          markEntityByName("", true),
        ];

        let dataReturn = await updateScapsTemplate(setOfInstructions);
        console.log(dataReturn);
        break;
    }
  });

  connection.on("end", function () {
    console.log("client disconnected");
  });

  connection.pipe(connection);
});
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, function () {
  console.log("=== Instrumec-Scrittore SAMLight middleware ===\n");
  console.log(
    `Server listening for connection requests on socket ${ipAddress}:${port}`
  );
  console.log(
    "\nRefer to https://shorturl.at/dvyX0 for documentation on how to use"
  );
});

module.exports = {
  server,
};
