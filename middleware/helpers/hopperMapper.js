const { hoppers } = require("../../setup/hoppers.json");
const lodash = require("lodash");
const { getFromCache } = require("./cacheCommands");

const maptoHopper = (hopperNumber) => {
  const hopperCount = getFromCache("hopperCount");
  if (hopperCount[hopperNumber - 1] > 5) {
    return hopperNumber;
  } else if (hopperCount[hopperNumber - 1] === 0 || hopperCount[hopperNumber - 1] <= 5) {
    console.log("Empty Hopper ------ ");
    let alternativeHoppers = { ...hoppers };
    const selectedColor = lodash.get(alternativeHoppers, `H${hopperNumber}`);
    delete alternativeHoppers[`H${hopperNumber}`];
    const alternateColor = Object.keys(alternativeHoppers).find((key) => alternativeHoppers[key] === selectedColor);
    console.log("alternateColor", alternateColor);
    return alternateColor.replace("H", "");
  }
};

const setHopperCount = (count) => {
  return count;
};

const formatHopperCount = (hopperCount) => {
  const counts = hopperCount
    .split(" ")
    .map((hopper) => hopper.trim().replace(/(\r\n|\n|\r)/gm, ""))
    .filter((option) => option !== "");
  const countsInNumber = counts.map((option) => parseInt(option));
  console.log("Hopper Count ==== ", countsInNumber);
  return countsInNumber;
};

module.exports = { maptoHopper, setHopperCount, formatHopperCount };
