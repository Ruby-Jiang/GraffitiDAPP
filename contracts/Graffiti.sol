// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Graffiti{
    // Model a painter
    struct Painter{
        uint id;
        string name;
        string paintContent;
    }
    // Store accounts that have voted
    mapping(address => bool) public observers;
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

    function paint(uint _painterId, string memory content) public{
        //check painted
        require(!observers[msg.sender]);

        //require valid paint
        require(_painterId > 0 && _painterId <= paintersCount);

        // record that painter has painted? maynot be used.
        observers[msg.sender] = true;
        
        // update paint content
        painters[_painterId].paintContent = content;
    }


    // web3 accounts getting:
    // web3.eth.getAccounts()
    // get the first account:
    // web3.eth.getAccounts().then(function(i){Acc = i})
    // Acc[0]
}