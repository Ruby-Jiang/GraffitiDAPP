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

    it("allow a observer to paint content", function(){
        return Graffiti.deployed().then(function(instance){
            graffitiInstance = instance;
            painterId = 1;
            return graffitiInstance.paint(painterId,"blackpink",{from: accounts[0]});
        }).then(function(receipt){
            return graffitiInstance.observers(accounts[0]);
        }).then(function(painted){
            assert(painted, "the painter was marked as painted");
            return graffitiInstance.painters(painterId);
        }).then(function(painter){
            var paintContent = painter[2];
            assert.equal(paintContent, "blackpink", "update the painter's paint content");
        })
    });

    it("throws an exception for invalid painter", function() {
        return Graffiti.deployed().then(function(instance) {
          graffitiInstance = instance;
          return graffitiInstance.paint(99, "blackpink",{ from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return graffitiInstance.painters(1);
        }).then(function(painter1) {
          var paintContent = painter1[2];
          assert.equal(paintContent, "blackpink", "painter 1 did not observe");
          return graffitiInstance.painters(2);
        }).then(function(painter2) {
          var paintContent = painter2[2];
          assert.equal(paintContent, "", "painter 2 did not observe");
        });
      });
    
      it("throws an exception for double painting", function() {
        return Graffiti.deployed().then(function(instance) {
          graffitiInstance = instance;
          painterId = 2;
          graffitiInstance.paint(painterId, "blackberry",{ from: accounts[1] });
          return graffitiInstance.painters(painterId);
        }).then(function(painter) {
          var paintContent = painter[2];
          assert.equal(paintContent, "blackberry", "accepts first paint");
          // Try to paint again
          return graffitiInstance.paint(painterId, "blackpink",{ from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return graffitiInstance.painters(1);
        }).then(function(painter1) {
          var paintContent = painter1[2];
          assert.equal(paintContent, "blackpink", "painter 1 did not observe");
          return graffitiInstance.painters(2);
        }).then(function(painter2) {
          var paintContent = painter2[2];
          assert.equal(paintContent, "blackberry", "painter 2 did not observe");
        });
      });

});
