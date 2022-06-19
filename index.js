const express = require("express");
const server = require("./server");
const net = require("net");
const app = express();

app.use(express.json());

app.post("/commands", async (req, res) => {
  const clients = net.connect({ port: 5050, host: "0.0.0.0" }, () => {
    // 'connect' listener
    console.log(req.body);
    clients.write(req.body);
  });
  clients.once("data", (data) => {
    res.status(200).send({ data: data.toString() });
    clients.end();
  });
  clients.once("end", () => {
    console.log("disconnected from server");
  });
});

app.listen(5132, () => {
  console.log("Web-server connected --- ");
});
