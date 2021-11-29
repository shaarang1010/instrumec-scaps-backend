//create file writes

const fs = require("fs");

const randomFileNameGenerator = (patientName, patientNumber) => {
  return `output-${patientNumber}-${patientName}-${
    new Date().toISOString().split(".")[0]
  }.txt`;
};

const writeToFile = (filepath, data) => {
  let filename = `${filepath}/${randomFileNameGenerator(
    data.patientName,
    data.patientNumber
  )}`;
  fs.writeFile(filename, data.data, () => {
    if (err) {
      return console.log(err);
    }
    console.log(`${filename} written successfully!`);
  });
};

module.exports = {
  writeFile: writeToFile,
};
