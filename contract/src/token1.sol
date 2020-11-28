// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

import './lib.sol';




contract Token1 is Token {
    constructor() {
        symbol = "TOKEN1";
    }
}
