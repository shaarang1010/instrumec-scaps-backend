// Include Nodejs' net module.
const Net = require("net");
const os = require("os");
const { testScapsCommands } = require("../middleware/requestshandlers");
// The port on which the server is listening.
const port = 5050;
//Get ip address
const ipAddress = os.networkInterfaces()["Wi-Fi"][1].address;
// import request handler
const requestHandler = require("../middleware/requestshandlers");
const {
  testConnection,
  isMarking,
  loadSerialNumberFile,
  resetSerialNumber,
} = require("../middleware/scapsCommands");

// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
let server = Net.createServer(function (connection) {
  console.log("client connected");

  connection.on("data", async function (data) {
    switch (data.toString()) {
      case "TEST":
        let scapCommand = testConnection("BAU").toString();
        console.log(scapCommand);
        let returnValue1 = await testScapsCommands(scapCommand);
        console.log(returnValue1);
        break;
      case "WRK":
        console.log("working....");
        break;
      case "ISMARKING":
        let returnValue2 = await testScapsCommands(isMarking());
        console.log(returnValue2);
        break;
      case "LOADFILE":
        let filename = `C:/Users/User/Desktop/Projects/instrumec-scaps/scaps-datalog/output-13166-BARRON P-2021-12-16T04-02-33.xlsx`;
        let returnValue3 = await testScapsCommands(
          loadSerialNumberFile("hopperNumber", "5")
        );
        console.log(returnValue3);
        break;
      default:
        break;
    }
  });

  connection.on("end", function () {
    console.log("client disconnected");
  });

  connection.pipe(connection);
});
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, function () {
  console.log(
    `Server listening for connection requests on socket ${ipAddress}:${port}`
  );
});

// The server can also receive data from the client by reading from its socket.
/*socket.on("data", async function (chunk) {
    //console.log(`Data received from client: ${chunk.toString()}`);
    //console.log(requestHandler.processData(chunk.toString()));
    switch (chunk.toString) {
      case "TEST":
        let returnValue1 = await testScapsCommands(testConnection);
        console.log(returnValue1);
        break;
      case "WRK":
        console.log("working....");
        break;
      case "ISMARKING":
        let returnValue2 = await testScapsCommands(isMarking);
        console.log(returnValue2);
      default:
        break;
    }
  });

  // When the client requests to end the TCP connection with the server, the server
  // ends the connection.
  socket.on("end", function () {
    console.log("Closing connection with the client");
  });

  // Don't forget to catch error, for your own sake.
  socket.on("error", function (err) {
    console.log(`Error: ${err}`);
  }); 
});*/

module.exports = {
  server,
};
