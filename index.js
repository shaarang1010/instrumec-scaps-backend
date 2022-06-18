const express = require("express");
const server = require("./server");
const net = require("net");
const app = express();

app.get("/data", (req, res) => {
  const clients = net.connect({ port: 5050, host: "192.168.1.102" }, () => {
    // 'connect' listener
    console.log("connected to server!");
    clients.write("MIDDLEWARE\n");
  });
  clients.on("data", (data) => {
    console.log(data.toString());
    clients.end();
  });
  clients.on("end", () => {
    console.log("disconnected from server");
  });
  res.status(200).send({ hello: "world" });
});

app.listen(5132);
