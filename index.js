const express = require("express");
const server = require("./server");
const cors = require("cors");
const net = require("net");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/commands", async (req, res) => {
  const clients = net.connect({ port: 5050, host: "0.0.0.0" }, () => {
    // 'connect' listener
    console.log(req.body);
    const { command } = req.body;
    clients.write(command);
  });
  clients.once("data", async (data) => {
    res.status(200).send({ data: data.toString("utf-8") });
    clients.end();
  });
  clients.once("end", () => {
    console.log("disconnected from server");
  });
});

app.listen(5132, () => {
  console.log("Web-server connected --- ");
});
