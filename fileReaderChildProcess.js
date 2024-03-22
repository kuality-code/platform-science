const fs = require("fs");
const readline = require("readline");

process.on("message", (filePath) => {
  const dataArray = [];
  const readLine = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  readLine.on("line", (line) => {
    let resourceInfo = {
      name: line,
      length: line.length - line.split(" ").length + 1,
      factors: findFactors(line.length),
    };

    if (filePath.includes("DriverNames")) {
      const vowels = findVowels(line);
      Object.assign(resourceInfo, {
        vowelsCount: vowels,
        consonantsCount: line.length - vowels - line.split(" ").length + 1,
      });
    }
    dataArray.push(resourceInfo);
  });

  readLine.on("error", (error) => {
    console.error("File reading error:", error);
    process.send({
      error: `Error reading file at ${filePath}: ${error.message}`,
    });
  });

  readLine.on("close", () => {
    process.send({ filePath, dataArray });
  });
});

const findFactors = (number) => {
  const factors = [];
  for (let i = Math.floor(number / 2); i > 1; i--) {
    if (number % i === 0) factors.push(i);
  }
  return factors;
};

const findVowels = (string) => {
  let vowelCount = 0;
  string.split("").forEach((character) => {
    ["a", "e", "i", "o", "u"].includes(character) && vowelCount++;
  });
  return vowelCount;
};
