const { verify } = require("crypto");
const fs = require("fs");
const path = require("path");
const { version } = require("process");
const config = require("./config");
const utils = require("./utils");

function readFile(fileName) {
  return JSON.parse(fs.readFileSync(path.join(config.output, fileName)));
}

console.log("Step 2. reposWithJSON.json");
let data = readFile("reposWithJSON.2.json");
console.log("Project with JSON", data.length);
console.log("Step 7. reposWithJSON_with_test_results.json");
data = readFile("reposWithJSON_with_test_results.json");
let nbRepo = 0;
let flaky = 0;
let libs = {};
repo: for (let repo in data) {
  const d = data[repo];
  if (d.test_results) {
    if (utils.isFlaky(d.test_results)) {
      flaky++;
    }
    for (test of d.test_results) {
      if (test == null) {
        continue repo;
      }
      if (test.error != 0 || test.failing != 0 || test.passing <= 0) {
        continue repo;
      }
    }
    nbRepo++;
    for (let pom of d.poms) {
      for (let dep of pom.deps) {
        if (dep.version) {
          if (libs[dep.lib] == null) {
            libs[dep.lib] = {};
          }
          if (libs[dep.lib][dep.version] == null) {
            libs[dep.lib][dep.version] = 0;
          }
          libs[dep.lib][dep.version]++;
        }
        libs[dep.lib].count = (libs[dep.lib].count || 0) + 1;
      }
    }
  }
}
console.log(libs);
console.log("# repo", nbRepo);
console.log("# flaky", flaky);

console.log("Step 7. reposWithJSON_with_static_analysis.json");
data = readFile("reposWithJSON_with_static_analysis.json");
nbRepo = 0;
let packages = {};
repo: for (let repo in data) {
  const d = data[repo];
  if (d.test_results) {
    for (test of d.test_results) {
      if (test == null) {
        continue repo;
      }
      if (test.error != 0 || test.failing != 0 || test.passing <= 0) {
        continue repo;
      }
    }
    if (!d["static-usages"]) {
      continue;
    }
    if (Object.keys(d["static-usages"]).length == 0) {
      continue;
    }
    for (let package in d["static-usages"]) {
      packages[package] =
        (packages[package] || 0) +
        Object.keys(d["static-usages"][package]).length;
    }
    nbRepo++;
  }
}
console.log(packages);
console.log("# repo", nbRepo);
