const { hoppers } = require("../../setup/hoppers.json");
const lodash = require("lodash");

const maptoHopper = (emptyHoppers, hopperNumber) => {
  const isEmpty = emptyHoppers.includes(hopperNumber);
  console.log(isEmpty);
  if (!isEmpty) {
    return hopperNumber;
  } else {
    const selectedHopper = lodash.get(hoppers, `H${hopperNumber}`);
    const hoppersOfColor = lodash.findKey(hoppers, selectedHopper);
    const alternativeHopper = lodash.first(hoppersOfColor.filter((hopper) => hopper !== `H${hopperNumber}`));
    return alternativeHopper;
  }
};

module.exports = maptoHopper;
