const notifier = require("node-notifier");

const notificationMessage = (message, title) => {
  notifier.notify({
    title,
    message
  });
};

module.exports = { notificationMessage };
