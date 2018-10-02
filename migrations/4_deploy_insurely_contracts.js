const InsurelyToken = artifacts.require("InsurelyToken");

module.exports = function(deployer) {
  deployer.deploy(InsurelyToken, 0);
};
