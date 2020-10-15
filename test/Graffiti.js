var Graffiti = artifacts.require("./Graffiti.sol");

contract("Graffiti", function(accounts){
    var graffitiInstance;

    it("initializes with two painters", function(){
        return Graffiti.deployed().then(function(instance){
            return instance.paintersCount();
        }).then(function(count){
            assert.equal(count, 2);
        });
    });

    it("it initializes the painters with the correct contents", function(){
        return Graffiti.deployed().then(function(instance){
            graffitiInstance = instance;
            return graffitiInstance.painters(1);
        }).then(function(painter){
            assert.equal(painter[0], 1, "contains the correct id");
            assert.equal(painter[1], "Painter 1", "contains the correct name");
            assert.equal(painter[2], "", "contains the correct content");
            return graffitiInstance.painters(2);
        }).then(function(painter){
            assert.equal(painter[0], 2, "contains the correct id");
            assert.equal(painter[1], "Painter 2", "contains the correct name");
            assert.equal(painter[2], "", "contains the correct content");
            return graffitiInstance.painters(2);
        });
    });

});
