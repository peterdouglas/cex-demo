const RentisToken = artifacts.require("RentisToken");

module.exports = function(deployer) {
  deployer.deploy(RentisToken, 0);
};
