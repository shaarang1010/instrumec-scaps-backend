const loadJob = (jobpath) => {
  let cci_return = `ScCciLoadJob("${jobpath}", 1, 1, 1)<LF>`;
  return cci_return;
};

const isMarking = () => {
  let cci_return = `ScCciIsMarking()<LF>`;
  return cci_return;
};

const markEntityByName = (entityName, waitForMarkEnd) => {
  let markValue = waitForMarkEnd === true ? 1 : 0;
  let cci_return = `ScCciMarkEntityByName("${entityName}", ${markValue})<LF>`;
  return cci_return;
};

const loadSerialNumberFile = (entityName, filepath) => {
  let cci_return = `ScCciSetEntityStringData("${entityName}", ${2}, "${filepath}")<LF>`;
  return cci_return;
};

const resetSerialNumber = () => {
  let cci_return = `ScCciResetSerialNumbers<LF>`;
  return cci_return;
};

const testConnection = (message) => {
  let cci_return = `ScCciTest("${message}")<LF>`;
  return cci_return;
};

module.exports = {
  loadJob: loadJob,
  isMarking: isMarking,
  markEntityByName: markEntityByName,
  loadSerialNumberFile: loadSerialNumberFile,
  resetSerialNumber: resetSerialNumber,
  testConnection: testConnection,
};
