pragma solidity ^0.4.17;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";

contract RentisToken is MintableToken, BurnableToken {
    string public name = "Rentis Rewards Token";      //  token name
    string public symbol = "RRT";           //  token symbol
    uint256 public decimals = 8;

    function RentisToken(uint _initialSupply) public payable {
        balances[msg.sender] = _initialSupply;
        totalSupply_ = _initialSupply;
    }
}
