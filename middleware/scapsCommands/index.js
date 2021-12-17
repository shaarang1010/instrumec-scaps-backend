const loadJob = (jobpath) => {
  let cci_return = `ScCciLoadJob("${jobpath}", 1, 1, 1)<LF>`;
  return new Promise((resolve, reject) => {
    resolve(cci_return);
    reject({ error: "Error in loading job", cci: cci_return });
  });
};

const isMarking = () => {
  let cci_return = `ScCciIsMarking()<LF>`;
  return new Promise((resolve, reject) => {
    resolve(cci_return);
    reject({ error: "Error in isMarking", cci: cci_return });
  });
};

const markEntityByName = (entityName, waitForMarkEnd) => {
  let markValue = waitForMarkEnd === true ? 1 : 0;
  let cci_return = `ScCciMarkEntityByName("${entityName}", ${markValue})<LF>`;
  return new Promise((resolve, reject) => {
    resolve(cci_return);
    reject({ error: "Error mark entity by name", cci: cci_return });
  });
};

const loadSerialNumberFile = (entityName, filepath) => {
  let cci_return = `ScCciSetEntityStringData("${entityName}", 24, "${filepath}")<LF>`;
  return new Promise((resolve, reject) => {
    resolve(cci_return);
    reject({ error: "Error load serial number file", cci: cci_return });
  });
};

const resetSerialNumber = () => {
  let cci_return = `ScCciResetSerialNumbers<LF>`;
  return new Promise((resolve, reject) => {
    resolve(cci_return);
    reject({ error: "Failed reset serial number", cci: cci_return });
  });
};

module.exports = {
  loadJob: loadJob,
  isMarking: isMarking,
  markEntityByName: markEntityByName,
  loadSerialNumberFile: loadSerialNumberFile,
  resetSerialNumber: resetSerialNumber,
};
