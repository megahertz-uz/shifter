const core = require('@actions/core');
const github = require('@actions/github');

try {
  const delimiter = core.getInput('delimiter').concat("\n")
  const equal_sign = core.getInput('equal_sign')
  const patterns = core.getInput('patterns').split(delimiter);
  const patterns_dict = {};
  patterns.forEach(item => {
    const [key, value] = item.split(equal_sign);
    patterns_dict[key] = value;
  })
  console.log(patterns_dict);
  console.log(delimiter, equal_sign, patterns);
} catch (error) {
  core.setFailed(error.message);
}