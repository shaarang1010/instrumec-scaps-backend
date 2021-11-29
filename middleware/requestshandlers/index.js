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

const processDataFromClient = (data) => {};
