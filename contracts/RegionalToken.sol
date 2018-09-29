pragma solidity ^0.4.17;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";

contract RegionalToken is MintableToken, BurnableToken {
    string public name;      //  token name
    string public symbol;           //  token symbol
    uint256 public decimals = 8;

    function RegionalToken(uint _initialSupply, string _name, string _symbol) public payable {
        balances[msg.sender] = _initialSupply;
        totalSupply_ = _initialSupply;
        name = _name;
        sybol = _symbol;
    }
}
