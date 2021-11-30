//create file writes

const fs = require("fs");

const xlsx = require("xlsx");

const randomFileNameGenerator = (patientName, patientNumber, filetype) => {
  return `output-${patientNumber}-${patientName}-${
    new Date().toISOString().split(".")[0]
  }.${filetype ? "txt" : "xlsx"}`;
};

const writeToFile = (filepath, data) => {
  let filename = `${filepath}/${randomFileNameGenerator(
    data.patientName,
    data.patientNumber
  )}`;
  /*fs.writeFile(filename, data.data, () => {
    if (err) {
      return console.log(err);
    }
    console.log(`${filename} written successfully!`);
  });*/
};

module.exports = {
  writeFile: writeToFile,
};
