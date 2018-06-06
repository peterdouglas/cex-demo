const MainToken = artifacts.require("MainToken");

module.exports = function(deployer) {
  deployer.deploy(MainToken);
};
