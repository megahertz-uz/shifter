const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('node:fs');

try {
  const delimiter = core.getInput('delimiter').concat("\n")
  const equal_sign = core.getInput('equal_sign')
  const patterns = core.getInput('patterns').split(delimiter);
  var locations = core.getInput('locations').split("\n");
  var patterns_dict = {};

  patterns.forEach(item => {
    const [key, value] = item.split(equal_sign);
    patterns_dict[key] = value;
  })

  console.log("Patterns: ", patterns_dict);
  console.log("Locations: ", locations);

  function replaceTextInFile(filePath, pattern, value) {
    const data = fs.readFileSync(filePath,
    { encoding: 'utf8', flag: 'r' });
    const updatedData = data.replace(new RegExp(pattern, 'g'), value);
    fs.writeFileSync(filePath, updatedData);
    console.log(`'${pattern}' replaced to '${value}' successfully in ${filePath}`);
  }

  locations.forEach((location) =>{
    for (const [key, value] of Object.entries(patterns_dict)) {
        replaceTextInFile(location, key, value)
    }
  })

} catch (error) {
  core.setFailed(error.message);
}