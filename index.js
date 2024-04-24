const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('node:fs');

try {
  const delimiter = core.getInput('delimiter').concat("\n")
  const equal_sign = core.getInput('equal_sign')
  const patterns = core.getInput('patterns').split(delimiter);
  const locations = core.getInput('locations').split("\n");
  const patterns_dict = {};

  patterns.forEach(item => {
    const [key, value] = item.split(equal_sign);
    patterns_dict[key] = value;
  })

  console.log("Patterns: ", patterns_dict);
  console.log("Locations: ", locations);

  function replaceTextInFile(filePath, pattern, value) {
    fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        return;
    }
    const updatedData = data.replace(new RegExp(pattern, 'g'), value);
    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing to file: ${err}`);
            return;
        }
        console.log(`Text replaced successfully in ${filePath}`);
    });
    });
  }

  locations.forEach((location) =>{
    for (const [key, value] of Object.entries(patterns)) {
        replaceTextInFile(location, key, value)
    }
  })

} catch (error) {
  core.setFailed(error.message);
}