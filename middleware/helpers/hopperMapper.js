const { hoppers } = require("../../setup/hoppers.json");
const lodash = require("lodash");
const emptyHoppers = [1, 2, 3, 5, 6, 9];

const maptoHopper = (hopperNumber) => {
  console.log("Inside map to hopper");
  const isEmpty = emptyHoppers.includes(hopperNumber);
  console.log(isEmpty);
  if (!isEmpty) {
    console.log("============================");
    const selectedHopper = lodash.get(hoppers, `H${hopperNumber}`);
    console.log(selectedHopper);
    const hoppersOfColor = lodash.findKey(hoppers, selectedHopper);
    const findAlternative = Object.entries(hoppers).filter((key, value) => {
      console.log(value);
      return value === selectedHopper;
    });
    console.log(findAlternative);
    // const alternativeHopper = lodash.first(hoppersOfColor.filter((hopper) => hopper !== `H${hopperNumber}`));
    // console.log(alternativeHopper);
    console.log("============================");
    return hopperNumber;
  } else {
    console.log("============================");
    const selectedHopper = lodash.get(hoppers, `H${hopperNumber}`);
    console.log(selectedHopper);
    const hoppersOfColor = lodash.findKey(hoppers, selectedHopper);
    console.log(selectedHopper);
    const alternativeHopper = lodash.first(hoppersOfColor.filter((hopper) => hopper !== `H${hopperNumber}`));
    console.log(alternativeHopper);
    console.log("============================");
  }
};

module.exports = maptoHopper;
