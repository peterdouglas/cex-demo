pragma solidity ^0.4.17;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";

contract InsurelyToken is MintableToken, BurnableToken {
    string public name = "Insurely Loyalty Coin";      //  token name
    string public symbol = "ILC";           //  token symbol
    uint256 public decimals = 8;

    function InsurelyToken(uint _initialSupply) public payable {
        balances[msg.sender] = _initialSupply;
        totalSupply_ = _initialSupply;
    }
}
