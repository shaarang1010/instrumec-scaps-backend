// Include Nodejs' net module.
const Net = require("net");
const os = require("os");
const { serialDataFormatters } = require("../middleware/helpers/serialDataFormatters");
const { testScapsCommands, updateScapsTemplate } = require("../middleware/requestshandlers");
const notifier = require("../middleware/helpers/notifier");
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
  markEntityByName
} = require("../middleware/scapsCommands");

//import serial handlers
const { writeToSerial, readSerialData } = require("../serial");
const { serialCommands } = require("../../config/serialcommands.json");
const formatOptions = require("../../config/formatter.json");
const { getFromCache } = require("../middleware/helpers/cacheCommands");
const maptoHopper = require("../middleware/helpers/hopperMapper").maptoHopper;

//import hopper file

let hopperCount = 0;

const doMagzineCheck = () => {
  return new Promise(async (resolve, reject) => {
    let magzineCheckMessage = serialDataFormatters(serialCommands.magazineCheck.send);
    const magzineCheck = await writeToSerial(magzineCheckMessage);
    console.log("magzine Check", magzineCheck);
    if (getFromCache("hopperCount").length !== 10) {
      const magzineCheck = await writeToSerial(magzineCheckMessage);
    }
    resolve(1);
  });
};

const printJob = (item) => {
  return new Promise(async (resolve, reject) => {
    const patientData = await requestHandler.processData(item);
    const hopper = maptoHopper(parseInt(patientData.hopper));
    if (hopper !== false) {
      const setHopperPos = await Promise.all([
        writeToSerial(serialDataFormatters(serialCommands.setCurrentPos.send, hopper - 1)),
        readSerialData(serialCommands.setCurrentPos.expect)
      ]);
      let setOfInstructions = [
        loadEntityDataToTemplate("hopperNumber", patientData.hopper),
        loadEntityDataToTemplate("patientName", patientData.patientName),
        loadEntityDataToTemplate("specimen", patientData.specimen),
        markEntityByName("", true)
      ];
      setOfInstructions.map(async (instruction) => {
        console.log(instruction);
        let dataReturn = await Promise.all([updateScapsTemplate(client, instruction)]);
        console.log(dataReturn);
      });
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

const client = new Net.Socket();
client.connect(
  {
    port: formatOptions.scapsConfig.port,
    host: formatOptions.scapsConfig.ipAddress
  },
  function () {
    // If there is no error, the server has accepted the request and created a new
    // socket dedicated to us.
    console.log("TCP connection established with the SCAPS SamLight.");
  }
);
client.once("end", () => {
  console.log("Ending connection");
});

// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
let server = Net.createServer(function (connection) {
  console.log("client connected");

  connection.once("data", async function (info) {
    switch (info.toString()) {
      case "TEST":
        let scapCommand = testConnection("Communication with Instrumec Scrittore is up..").toString();
        let returnValue1 = await testScapsCommands(client, scapCommand);
        console.log("returnvalue", returnValue1);
        break;
      case "MIDDLEWARE":
        console.log("working....");
        break;
      case "ISMARKING":
        let returnValue2 = await testScapsCommands(client, isMarking());
        console.log(returnValue2);
        break;
      case "PRINTJOB":
        let returnValue = await testScapsCommands(client, markEntityByName("", true));
        console.log(returnValue);
        break;
      case "REBOOT":
        let rebootMessage = serialDataFormatters(serialCommands.reboot.send);
        let reboot = await writeToSerial(rebootMessage);
        return await readSerialData(serialCommands.reboot.expect);
      case "ACTIVATE_LASER":
        let message = serialDataFormatters(serialCommands.activateLaser.send, 1);
        const activateLaser = await writeToSerial(message);
        console.log(await readSerialData(serialCommands.activateLaser.expect));
        break;
      case "DE_ACTIVATE_LASER":
        let deActivatemessage = serialDataFormatters(serialCommands.activateLaser.send, 0);
        const deActivateLaser = await writeToSerial(deActivatemessage);
        return await readSerialData(serialCommands.activateLaser.expect);
      case "RESCAN":
        let carouselRescanMessage = serialDataFormatters(serialCommands.carouselRescan.send);
        const rescan = await writeToSerial(carouselRescanMessage);
        console.log(rescan);
        return await readSerialData(serialCommands.carouselRescan.expect);
      case "MAGZINE_CHECK":
        let magzineCheckMessage = serialDataFormatters(serialCommands.magazineCheck.send);
        const magzineCheck = await writeToSerial(magzineCheckMessage);
        console.log("magzine Check", magzineCheck);
        console.log("Serial data waiting ===", await readSerialData(serialCommands.magazineCheck.expect, true));
        break;
      case "GET_POS":
        let getPositionMessage = serialDataFormatters(serialCommands.getCurrentPos.send);
        const currentPosition = await writeToSerial(getPositionMessage);
        console.log(currentPosition);
        return await readSerialData(serialCommands.getCurrentPos.expect);
      case "SET_POS":
        let currentPosMessage = serialDataFormatters(serialCommands.setCurrentPos.send, 4);
        const setCurrentPos = await writeToSerial(currentPosMessage);
        console.log(setCurrentPos);
        return await readSerialData(serialCommands.setCurrentPos.expect);
      case "SET_SLIDE_LEFT":
        let currentSlide = serialDataFormatters(serialCommands.setSlide.send, 1);
        const setSlidePos = await writeToSerial(currentSlide);
        console.log(setSlidePos);
        return await readSerialData(serialCommands.setSlide.expect);
      case "SET_SLIDE_RIGHT":
        let slidPos = serialDataFormatters(serialCommands.setSlide.send, 0);
        const setSlidePosition = await writeToSerial(slidPos);
        console.log(setSlidePosition);
        return await readSerialData(serialCommands.setSlide.expect);
      case "TEST_PRINT":
        let testMessage = serialDataFormatters(serialCommands.test.send);
        const testSerial = await writeToSerial(testMessage);
        console.log(testSerial);
        return await readSerialData(serialCommands.test.expect);
      case "HELP":
        let helpMessage = serialDataFormatters(serialCommands.help.send);
        const helpSerial = await writeToSerial(helpMessage);
        console.log(helpSerial);
        return await readSerialData(serialCommands.help.expect);
      default:
        const receivedData = info.toString().split("\n");
        notifier.notificationMessage(`Printing job of ${receivedData.length} cassettes`, "Success");
        const checkHopperLevels = await doMagzineCheck();
        const processData = async () => {
          for (const item of receivedData) {
            const res = await printJob(item);
            await new Promise((resolve) => setTimeout(resolve, 10000));
            if (!res) {
              notifier.notificationMessage("Cassettes are empty. Please add cassettes and try again!", "Error");
              break;
            }
          }
        };
        processData();
    }
  });

  connection.once("end", function () {
    console.log("client disconnected");
  });

  connection.once("error", () => {
    notifier.notificationMessage("Error connecting to Samlight. Please check if the application is running", "Error");
  });

  connection.pipe(connection);
});
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, function () {
  console.log("=== Instrumec-Scrittore SAMLight middleware ===\n");
  console.log(`Server listening for connection requests on socket ${ipAddress}:${port}`);
  console.log("\nRefer to https://shorturl.at/dvyX0 for documentation on how to use");
});

module.exports = {
  server
};
