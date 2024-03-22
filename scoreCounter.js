const { fork } = require("child_process");
const files = ["./DriverNames.txt", "./StreetAddresses.txt"];

function handleChildProcess(filePath) {
  return new Promise((resolve, reject) => {
    const child = fork("fileReaderChildProcess.js");
    child.send(filePath);

    child.on("message", (message) => {
      resolve(message);
    });

    child.on("error", reject);
  });
}

const calculateSuitabilityScore = (driversInfo, addressesInfo) => {
  const suitabilityScoreTable = {};
  addressesInfo.forEach((address) => {
    let addressName = address.name;
    let addressSuitability = {};
    let previousSuitability = 0;
    let previousDriver = "";

    driversInfo.forEach((driver) => {
      let driverName = driver.name;
      let driverSuitability =
        address.length % 2 == 0
          ? driver.vowelsCount * 1.5
          : driver.consonantsCount;

      address.factors.some((commonFactor) =>
        driver.factors.includes(commonFactor)
      ) && (driverSuitability *= 1.5);

      if (driverSuitability > previousSuitability) {
        previousSuitability = driverSuitability;
        previousDriver = driverName;
      }
    });

    addressSuitability["Driver"] = previousDriver;
    addressSuitability["Suitability_Score"] = previousSuitability;
    driversInfo = driversInfo.filter((driver) => driver.name != previousDriver);

    suitabilityScoreTable[addressName] = addressSuitability;
  });

  return suitabilityScoreTable;
};

(async () => {
  try {
    const [drivers, addresses] = await Promise.all([
      handleChildProcess(files[0]),
      handleChildProcess(files[1]),
    ]);

    const suitabilityScoreTable = calculateSuitabilityScore(
      drivers.dataArray,
      addresses.dataArray
    );

    console.log(
      "\nThe best drivers for each address and their respective Suitability Scores are mentioned below:\n"
    );
    console.table(suitabilityScoreTable);
  } catch (error) {
    console.error("An error occurred in one of the child processes:", error);
    return error;
  }
})();
