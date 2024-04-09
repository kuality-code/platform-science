const munkres = require("munkres-js");
const { fork } = require("child_process");
const files = ["./DriverNames.txt", "./StreetAddresses.txt"];

// This function spawns a child process to handle file reading asynchronously
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

// This function constructs a cost matrix for the Hungarian algorithm
// It inverses the suitability score since the algorithm finds the minimum cost
function calculateCostMatrix(driversInfo, addressesInfo) {
  return driversInfo.map((driver) =>
    addressesInfo.map((address) => {
      let baseSS =
        address.name.length % 2 === 0
          ? driver.vowelsCount * 1.5
          : driver.consonantsCount;
      let commonFactors = address.factors.some((factor) =>
        driver.factors.includes(factor)
      );
      if (commonFactors) {
        baseSS *= 1.5;
      }
      return -baseSS; // Negate the suitability score for the algorithm
    })
  );
}

// Main execution function
(async () => {
  try {
    // Read and process driver and address data concurrently
    const [drivers, addresses] = await Promise.all([
      handleChildProcess(files[0]),
      handleChildProcess(files[1]),
    ]);

    // Generate the cost matrix based on driver and address info
    const costMatrix = calculateCostMatrix(
      drivers.dataArray,
      addresses.dataArray
    );

    // Use the Hungarian algorithm to find the optimal assignments
    const results = munkres(costMatrix);

    let totalSuitabilityScore = 0;
    console.log(
      "\nThe best drivers for each address and their respective Suitability Scores are mentioned below:\n"
    );

    // Prepare and output the data without index and in plain format
    results.forEach(([driverIndex, addressIndex]) => {
      const score = -costMatrix[driverIndex][addressIndex]; // Convert back to a positive score
      totalSuitabilityScore += score;

      // Output each assignment on a new line
      console.log(`Address: ${addresses.dataArray[addressIndex].name}`);
      console.log(`Driver: ${drivers.dataArray[driverIndex].name}`);
      console.log(`Suitability Score: ${score}`); // Output as a number
      console.log(); // Blank line for separation
    });
  } catch (error) {
    console.error("An error occurred in one of the child processes:", error);
  }
})();
