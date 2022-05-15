const path = require("path");
const notifier = require("node-notifier");

const notificationMessage = (message, title) => {
  notifier.notify({
    title: `Instrumec Scrittore - ${title}`,
    message,
    icon: path.join(__dirname, "../../assets/instrumec-scrittore-logo.png")
  });
};

module.exports = { notificationMessage };
