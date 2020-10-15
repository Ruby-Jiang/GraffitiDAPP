// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Graffiti{
    // Model a painter
    struct Painter{
        uint id;
        string name;
        string paintContent;
    }
    // Store Painters
    // Fetch Painter
    mapping(uint => Painter) public painters;
    // Store Painters Count
    uint public paintersCount;
    // Constructor

    constructor() public {
        addPainter("Painter 1");
        addPainter("Painter 2");
    }

    function addPainter (string memory _name) private{
        paintersCount++;
        painters[paintersCount] = Painter(paintersCount, _name, "");
    }
}