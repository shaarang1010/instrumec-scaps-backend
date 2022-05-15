const { hoppers } = require("../../setup/hoppers.json");
const lodash = require("lodash");
const { getFromCache, setToCache } = require("./cacheCommands");

const maptoHopper = (hopperNumber) => {
  const hopperCount = getFromCache("hopperCount");
  let hopper = "";
  let index = 0;
  if (hopperCount[hopperNumber - 1] > 5) {
    index = hopperNumber - 1;
    hopper = hopperNumber;
  } else if (hopperCount[hopperNumber - 1] === 0 || hopperCount[hopperNumber - 1] <= 5) {
    console.log("Empty Hopper ------ ");
    let alternativeHoppers = { ...hoppers };
    const selectedColor = lodash.get(alternativeHoppers, `H${hopperNumber}`);
    console.log("Selected Color ==== ", selectedColor);
    delete alternativeHoppers[`H${hopperNumber}`];
    const alternateColor = Object.keys(alternativeHoppers).find((key) => alternativeHoppers[key] === selectedColor);
    console.log("alternateColor ===== ", alternateColor);
    index = Object.keys(alternativeHoppers).indexOf(alternateColor) + 1;
    hopper = alternateColor.replace("H", "");
  }
  updateHopperCount(hopperCount, index);
  return hopper;
};

const setHopperCount = (count) => {
  return count;
};

const updateHopperCount = (hopperCount, index) => {
  const currentCount = [...hopperCount];
  currentCount[index] = currentCount[index] - 1;
  console.log("Setting Hoppers to =====", currentCount);
  setToCache("hopperCount", currentCount);
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
