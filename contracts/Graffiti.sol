// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Graffiti{
    // Model a painter
    struct Painter{
        uint id;
        address name;
        string paintContent;
    }
    // Store accounts that have voted
    mapping(address => bool) public observers;
    // Store Painters
    // Fetch Painter
    mapping(uint => Painter) public painters;
    // Store Painters Count
    uint public paintersCount;
    // uint public pixel_length = 10;
    // uint public pixel_width = 15;
    // Constructor

    constructor() public {
        // for(uint i = 0; i < pixel_length; i++){
        //     for(uint j = 0; j < pixel_width; j++){
        //         addPainter([i,j],"");
        //     }
        // }
        painters[0].id = 0;
        painters[0].name = 0xADb766CD8c67A91e07738E4e1D8719559975DA6f;
        painters[0].paintContent = "Hello";
        paintersCount = 1;
    }

    function paint(uint _painterId, string memory content) public{
        //check painted
        // require(!observers[msg.sender]);

        //require valid paint
        require(_painterId >= 0);

        // string storage sender = realaddress[msg.sender];

        // record that painter has painted? maynot be used.
        // observers[msg.sender] = true;
        
        // update paint content
        if (_painterId <= paintersCount){
            painters[_painterId].paintContent = content;
            painters[_painterId].name = msg.sender;
        }else
            paintersCount++;
            painters[paintersCount-1] = Painter(_painterId, msg.sender, content);
    }


    // web3 accounts getting:
    // web3.eth.getAccounts()
    // get the first account:
    // web3.eth.getAccounts().then(function(i){Acc = i})
    // Acc[0]
}