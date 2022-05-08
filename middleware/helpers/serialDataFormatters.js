const serialDataFormatters = (message, integerValue) => {
  // add trailing n
  const appendToMessage = integerValue !== undefined ? false : true;
  const messageToSend = appendToMessage ? message : `${message} ${integerValue}`;
  return `${messageToSend}\n`;
};

const matchExpectations = (message, expectation) => {
  return message.toString().includes(expectation);
};

module.exports = { serialDataFormatters, matchExpectations };
