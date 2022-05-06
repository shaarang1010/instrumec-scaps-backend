const serialDataFormatters = (message, integerValue) => {
  // add trailing n
  return `${message} ${integerValue && integerValue}\n`;
};

module.exports = serialDataFormatters;
