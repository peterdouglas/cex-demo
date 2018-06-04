pragma solidity ^0.4.17;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract RegionalToken is MintableToken {
  string public name = "Regional Health Coin";      //  token name
  string public symbol = "RHC";           //  token symbol
  uint256 public decimals = 8;

  function RegionalToken(uint _initialSupply) public payable {
    balances[msg.sender] = _initialSupply;
    totalSupply_ = _initialSupply;
  }
}
