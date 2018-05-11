Web3 = require('web3')

// Instance Web3 using localhost testrpc
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

$('#claim-token').click(() => {
    $('#token').html("");
    let preImage = $('#pre-image').val();
    let to = $('#new-owner-address').val();
    let claim = { preImage: preImage, to: to };
    console.log(`Claiming ${JSON.stringify(claim)}`);
    var tokenResult = "";
    if(preImage){

    }
    else{
        tokenResult = " <h3>You suck!</h3>";
    }

    $('#token').html("");
    $('#token').append(tokenResult);

  });