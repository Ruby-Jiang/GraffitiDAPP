App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Graffiti.json", function(graffiti) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Graffiti = TruffleContract(graffiti);
      // Connect provider to interact with contract
      App.contracts.Graffiti.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var graffitiInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();
    // Load account data
    // web3.eth.getCoinbase(function(err, account) {
    //   if (err === null) {
    //     var version = web3.version.api;
    //     console.log(version)
    //     App.account = account;
    //     $("#accountAddress").html("Your Account: " + account);
    //   }
    // });

    if(window.ethereum){
      ethereum.enable().then(function(acc){
          App.account = acc[0];
          $("#accountAddress").html("Your Account: " + App.account);
          console.log(web3.currentProvider.selectedAddress);
      });
    }

    // Load contract data
    App.contracts.Graffiti.deployed().then(function(instance) {
      graffitiInstance = instance;
      return graffitiInstance.paintersCount();
    }).then(function(paintersCount) {
      var paintersResults = $("#paintersResults");
      paintersResults.empty();

      var paintersSelect = $('#paintersSelect');
      paintersSelect.empty();

      for (var i = 1; i <= paintersCount; i++) {
        graffitiInstance.painters(i).then(function(painter) {
          var id = painter[0];
          var name = painter[1];
          var paintContent = painter[2];

          // Render painter Result
          var painterTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + paintContent + "</td></tr>";
          paintersResults.append(painterTemplate);

          // Render painter ballot option
          var painterOption = "<option value='" + id + "' >" + name + "</ option>";
          paintersSelect.append(painterOption);
        });
      }
      return graffitiInstance.observers(App.account);
    }).then(function(hasPainted){
      if(hasPainted){
        $('form').hide();
      }
      loader.hide();
      content.show(); 
    }).catch(function(error) {
      console.warn(error);
    });
  },


  castPaint: function(){
    var painterId = $('#paintersSelect').val();
    var paintContent = $('#paintContent').val();
    App.contracts.Graffiti.deployed().then(function(instance) {
      return instance.paint(painterId, paintContent,{ from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

