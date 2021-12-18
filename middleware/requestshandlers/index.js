const net = require("net");
const fileOperations = require("../filehandlers/fileOperations");
const formatOptions = require("../../formatter.json");

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
  const clientFormattingOptions = formatOptions.clients.filter(
    (option) => option.name === clientName
  )[0].formatOptions;

  let hopper = data.indexOf(clientFormattingOptions["hopper"]);
  let hospitalId = data.indexOf(clientFormattingOptions["hospitalNumber"]);
  let patientNumber = data.indexOf(clientFormattingOptions["patientNumber"]);
  let patientName = data.indexOf(clientFormattingOptions["patientName"]);
  let specimen = data.lastIndexOf(clientFormattingOptions["specimen"]);
  let specimenNumber = data.lastIndexOf(
    clientFormattingOptions["specimenNumber"]
  );

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
    data.substring(specimenNumber + 1, data.length),
  ];

  return new Promise((resolve, reject) => {
    resolve({
      hopper: printJob[0],
      patientNumber: printJob[2],
      patientName: printJob[3],
      specimen: `${printJob[4]}${printJob[5]}`,
      stringData: printJob.toString(),
    });

    reject({ error: "Error in processing data" });
  });
};

const processDataFromClient = async (data, numberOfJobs = 1) => {
  //TODO: add param to print jobs in batch
  let specimenNumberIndex = data.lastIndexOf(".");
  console.log(specimenNumberIndex);
  let specimenNumber = Number(
    data.substring(specimenNumberIndex + 1, data.length)
  );
  console.log(specimenNumber);
  for (let job = 0; job < numberOfJobs; job++) {
    specimenNumber = specimenNumber + job;
    let printData = data.substring(0, specimenNumberIndex + 1) + specimenNumber;
    const printJob = await formatData(printData, "boxhill");
    const fileLocation = formatOptions.filePath;
    fileOperations.writeToFile(fileLocation, printJob, { fileType: "xlsx" });
  }
};

module.exports = {
  processData: processDataFromClient,
};
