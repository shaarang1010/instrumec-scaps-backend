const net = require("net");
const fileOperations = require("../filehandlers/fileOperations");
const formatOptions = require("../../setup/formatter.json");

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
  let specimenNumber = Number(
    data.substring(specimenNumberIndex + 1, data.length)
  );
  for (let job = 0; job < numberOfJobs; job++) {
    specimenNumber = specimenNumber + job;
    let printData = data.substring(0, specimenNumberIndex + 1) + specimenNumber;
    const printJob = await formatData(printData, "boxhill");
    /*const fileLocation = formatOptions.filePath;
    let fileName = fileOperations.writeToFile(fileLocation, printJob, {
      fileType: "xlsx",
    });
    console.log(fileName);*/
    return printJob;
  }
};

const testScapsCommands = (cmd) => {
  const client = new net.Socket();
  client.connect(
    {
      port: formatOptions.scapsConfig.port,
      host: formatOptions.scapsConfig.ipAddress,
    },
    function () {
      // If there is no error, the server has accepted the request and created a new
      // socket dedicated to us.
      console.log("TCP connection established with the SCAPS SamLight.");

      // The client can now send data to the server by writing to its socket.
      console.log(
        `<Sent @ ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} to SAMlight> : ${cmd.toString()}`
      );
      client.write(cmd);
    }
  );

  client.on("data", (data) => {
    console.log(
      `<SAMLight Response @ ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}> => ${data}`
    );
    new Promise((resolve, reject) => {
      resolve(data);

      reject({ error: "Connection Issue", cci_error_code: data });
    });
  });
};

const updateScapsTemplate = (cmdInstructions) => {
  const client = new net.Socket();
  client.connect(
    {
      port: formatOptions.scapsConfig.port,
      host: formatOptions.scapsConfig.ipAddress,
    },
    function () {
      // If there is no error, the server has accepted the request and created a new
      // socket dedicated to us.
      console.log("TCP connection established with the SCAPS SamLight.");

      // The client can now send data to the server by writing to its socket.
      console.log(
        `<Sent @ ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} to SAMLight> : ${cmdInstructions[0].toString()}`
      );
      client.write(cmdInstructions[0]);
      cmdInstructions.splice(0, 1);
    }
  );

  client.on("data", (data) => {
    console.log(
      `<SAMLight Response @ ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}> => ${data}`
    );
    while (cmdInstructions.length !== 0) {
      console.log(
        `<Sent @ ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}> : ${cmdInstructions[0].toString()}`
      );
      client.write(cmdInstructions[0]);
      cmdInstructions.splice(0, 1);
      break;
    }
    new Promise((resolve, reject) => {
      resolve(data);

      reject({ error: "Connection Issue", cci_error_code: data });
    });
  });
};

module.exports = {
  processData: processDataFromClient,
  testScapsCommands: testScapsCommands,
  updateScapsTemplate: updateScapsTemplate,
};
