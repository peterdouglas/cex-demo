const RegionalToken = artifacts.require("RegionalToken");

module.exports = function(deployer) {
  deployer.deploy(RegionalToken, 0);
};
