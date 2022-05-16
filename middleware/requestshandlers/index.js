const fileOperations = require("../filehandlers/fileOperations");
const formatOptions = require("../../../config/formatter.json");
const { PromiseSocket, TimeoutError } = require("promise-socket");

/**
 * PRINTJOB LOGIC
 * 1. receive data from client
 * 2. process and format it based on the json file
 * 3. write the file
 * 4. load the template (scaps)
 * 5. send to serial (scaps)
 * 6. wait for response (scaps)
 * 7. send next job
 */

const formatData = (data, clientName) => {
  return new Promise((resolve, reject) => {
    const clientFormattingOptions = formatOptions.clients.filter((option) => option.name === clientName)[0]
      .formatOptions;

    let hopper = data.indexOf(clientFormattingOptions["hopper"]);
    let hospitalId = data.indexOf(clientFormattingOptions["hospitalNumber"]);
    let patientNumber = data.indexOf(clientFormattingOptions["patientNumber"]);
    let patientName = data.indexOf(clientFormattingOptions["patientName"]);
    let specimen = data.lastIndexOf(clientFormattingOptions["specimen"]);
    let specimenNumber = data.lastIndexOf(clientFormattingOptions["specimenNumber"]);

    const printJob = [
      data.substring(hopper + 3, hospitalId),
      data.substring(hospitalId + 2, patientNumber),
      data.substring(patientNumber + 1, patientName),
      data.substring(patientName + 4, specimen).trim().length > 11
        ? `${data
            .substring(patientName + 4, specimen)
            .trim()
            .subtr(0, 9)}*`
        : data.substring(patientName + 4, specimen).trim(),
      data.substring(specimenNumber - 1, specimenNumber),
      data.substring(specimenNumber + 1, data.length)
    ];

    resolve({
      hopper: printJob[0],
      patientNumber: printJob[2],
      patientName: printJob[3],
      specimen: `${printJob[4]}${printJob[5]}`,
      stringData: printJob.toString()
    });

    reject({ error: "Error in processing data" });
  });
};

const processDataFromClient = async (data, numberOfJobs = 1) => {
  //TODO: add param to print jobs in batch
  return new Promise(async (resolve, reject) => {
    let specimenNumberIndex = data.lastIndexOf(".");
    let specimenNumber = Number(data.substring(specimenNumberIndex + 1, data.length));
    for (let job = 0; job < numberOfJobs; job++) {
      specimenNumber = specimenNumber + job;
      let printData = data.substring(0, specimenNumberIndex + 1) + specimenNumber;

      const printJob = await formatData(printData, "boxhill");
      resolve(printJob);
      reject({ error: "Something went wrong!" });
    }
  });
};

const testScapsCommands = async (client, cmd) => {
  return new Promise((resolve, reject) => {
    console.log(
      `<Sent @ ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} to SAMlight> : ${cmd.toString()}`
    );
    client.write(cmd);

    client.once("data", (data) => {
      console.log("inside data");
      console.log(
        `<SAMLight Response @ ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}> => ${data}`
      );
      resolve(`Data = ${data}`);

      reject({ error: "Connection Issue", cci_error_code: "err" });
    });
  });
};

const updateScapsTemplate = async (client, cmdInstruction) => {
  return new Promise((resolve, reject) => {
    client.write(cmdInstruction);
    client.once("data", (data) => {
      console.log(
        `<SAMLight Response @ ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}> => ${data}`
      );
      console.log(
        `<Sent @ ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}> : ${cmdInstruction.toString()}`
      );
      resolve(data.toString());
      reject({ error: "Connection Issue", cci_error_code: "error" });
    });
  });
};

module.exports = {
  processData: processDataFromClient,
  testScapsCommands: testScapsCommands,
  updateScapsTemplate: updateScapsTemplate
};
