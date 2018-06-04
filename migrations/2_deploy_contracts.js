const MainToken = artifacts.require("MainToken");
const RegionalToken = artifacts.require("RegionalToken");

module.exports = function(deployer) {
  deployer.deploy(MainToken);
  deployer.deploy(RegionalToken, 0);
};
