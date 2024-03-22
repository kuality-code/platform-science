# Shipment Suitability Score Calculator

This application assigns shipment destinations to drivers in a way that maximizes the total suitability score (SS) over a set of drivers, following a specific set of rules. Each driver can only have one shipment, and each shipment can only be offered to one driver.

## How It Works

The application uses a top-secret algorithm to calculate the suitability score (SS) for assigning drivers to shipments based on the length of the shipment destination's street name and the driver's name characteristics. The algorithm criteria are as follows:

- If the shipment destination's street name length is even, the base SS is the number of vowels in the driver’s name multiplied by 1.5.
- If the length is odd, the base SS is the number of consonants in the driver's name.
- If the lengths share any common factors (besides 1), the SS is increased by 50% above the base SS.

## Requirements

- Node.js
- Two newline-separated text files: one containing the street addresses of the shipment destinations and the other containing the names of the drivers.

## Files

- scoreCounter.js: The main application script.
- fileReaderChildProcess.js: A child process script for reading the input files and calculating preliminary data.

## Setup

- Ensure Node.js is installed on your system.
- Place your driver names and street addresses in newline-separated text files.

## Usage

To run the application, execute the following command in your terminal, replacing DriverNames.txt and StreetAddresses.txt with the paths to your input files:

```
node scoreCounter.js
```

## Input Format

- DriverNames.txt: Newline-separated list of driver names.

```
John Doe
Jane Smith
```

- StreetAddresses.txt: Newline-separated list of street addresses (only the street name is used by the algorithm).

```
123 Elm Street
456 Maple Avenue
```

## Output

The application prints the total suitability score and the optimal matching between shipment destinations and drivers to the console.

## Example Output

```
The best drivers for each address and their respective Suitability Scores are mentioned below:

| Street Address    | Driver     | Suitability Score |
|-------------------|------------|-------------------|
| 123 Elm Street    | John Doe   | 9.0               |
| 456 Maple Avenue  | Jane Smith | 7.5               |

```

This output format provides a clear and concise summary of the assignment results, indicating which driver is best suited for each shipment destination based on the calculated suitability scores.
