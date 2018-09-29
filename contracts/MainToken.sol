pragma solidity ^0.4.17;

import "./LockableToken.sol";

contract MainToken is LockableToken {
    string public name = "Movera Auto Chain";      //  token name
    string public symbol = "MAC";           //  token symbol
    uint256 public decimals = 8;
    uint256 initialSupply = 100000000000000000000;
    function MainToken() public payable {
        balances[msg.sender] = initialSupply;
        totalSupply_ = initialSupply;
    }

}