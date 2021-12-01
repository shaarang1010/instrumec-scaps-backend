//create file writes

const fs = require("fs");
const os = require("os");
const path = require("path");
const xlsx = require("xlsx");

const randomFileNameGenerator = (patientName, patientNumber, filetype) => {
  return `output-${patientNumber}-${patientName}-${new Date()
    .toISOString()
    .split(".")[0]
    .replace(/:/g, "-")}.${filetype === "txt" ? "txt" : "xlsx"}`;
};

const writeToFile = (filepath, data, fileOptions) => {
  let filename = `${path.join(
    os.homedir(),
    filepath
  )}\\${randomFileNameGenerator(
    data.patientName,
    data.patientNumber,
    fileOptions.fileType
  )}`;

  if (fileOptions.fileType === "xlsx") {
    let worksheetData = data;

    delete worksheetData.stringData;

    let worksheet = xlsx.utils.json_to_sheet([worksheetData]);

    /* add to workbook */
    var workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "CassetteData");

    /* generate an XLSX file */
    xlsx.writeFile(workbook, filename);
  } else if (fileOptions.fileType === "txt") {
    fs.writeFileSync(filename, data.stringData, "utf-8");
  }
  console.log(`${filename} written successfully!`);
};

module.exports = {
  writeToFile: writeToFile,
};
