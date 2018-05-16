Web3 = require('web3')
import getContractInstance from "./app/getContractInstance"
//const createKeccakHash = require('keccak')
import createKeccakHash from 'keccak'
import { showError, GAS, web3, notOwner} from './app/constants';
import {tableHeading, tableTail, tableRow} from './app/polePositionTable';
//require("./app/getContractInstance")
const http = require('http');
var request = require('request');

const baseURL = 'http://localhost:8080/collectibleData/'


let somePreImage = "esta es la frase magica";
let someHash = "2d0fcdea612272668d6d99940f2cc4a79c5d06f3a9d1885e4a1021109921169c";
let tokenClaimInstance;
let leTokenInstance;
setup();

async function setup(){
    let instances = await getContractInstance();
    tokenClaimInstance = instances[1];
    leTokenInstance = instances[0];
    //await getContractInstance();
    // Instance Web3 using localhost testrpc
    //const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    // let hash = createKeccakHash('keccak256').update("Esta es la frase magica!").digest('hex');
    //tokenClaimInstance.addCollectibleBT.call("localhost",(error, result)=>{});
//    tokenClaimInstance.addCollectibleBT("ASD",await {from: Web3.eth.accounts[0]}); 
}

async function getPolePosition(){
    let pending = await tokenClaimInstance.collectiblesPendingToClaim();
    let claimed = await leTokenInstance.totalSupply();
    console.log("Collectibles pending:"+pending.valueOf()+" Claimed:"+claimed);
    $('#token').html("");
    let table = tableHeading;
    for(var i = 0; i < claimed.valueOf();i++){
        /// Need to change when contract is redesigned
        let d = await leTokenInstance.tokenURI(i);
        console.log("Token URI is:"+d);
        let preUri = JSON.parse(d);
        let uri = preUri['image'];
        console.log("will fetch:"+uri);
        request({url:uri},function (error, response, body) {
                console.log('error:', error); 
                console.log('statusCode:', response && response.statusCode); 
                console.log("le body:", body);
                let j = JSON.parse(body);
                console.log("adding the following collectible to the table");
                console.log(j);
                var row = document.createElement('tr');
                var col = document.createElement('td');
                var col2 = document.createElement('td');
                var col3 = document.createElement('td');
                row.appendChild(col); 
                row.appendChild(col2);
                row.appendChild(col3);
                col.innerHTML = '<img height="64" width="64" src="'+j['image']+'" alt=""></td>'
                col2.innerHTML = j['name'];
                col3.innerHTML = j['description']; 
                var table = document.getElementById("pole-position"); 
                table.appendChild(row);
            });
        
    }
    table+='<tr><td align="center" colspan="3">"Collectibles pending to claim"</td></tr>';
    for(var i = 0; i < pending.valueOf();i++){
        table+=tableRow("http:default",someHash,"Not claimed yet");
    }
    table+='<tr><td align="center" colspan="3">"Collectibles claimed"</td></tr>';
    table+=tableTail;
    $('#token').append(table);

}
async function claimCollectible(to, preImage) {
    let claim = { preImage: preImage, to: to };
    console.log(`Claiming ${JSON.stringify(claim)}`);
    let supply = await leTokenInstance.totalSupply();
    await tokenClaimInstance.claimcollectible(to,preImage,{gas:GAS}); 
    let newSupply = await leTokenInstance.totalSupply();
    console.log("New value is:"+newSupply.valueOf()+" Old value is:"+supply.valueOf());
    return (newSupply.valueOf() > supply.valueOf());
}

$('#claim-token').click(() => {
    $('#token').html("");
    let preImage = $('#pre-image').val();
    let to = notOwner;
    var tokenResult = "";
    if(preImage){
        if(claimCollectible(to, preImage)){
            tokenResult = "YAY!";
            // getPolePosition();

        }
        else{
            tokenResult = " <h3>You suck!</h3>";
        }
    }
    else{
        tokenResult = " <h3>Y la vaca????</h3>";
    }
    $('#token').html("");
    $('#token').append(tokenResult);
  });

  $('#add-token').click(()=>{
    let owner = tokenClaimInstance.owner();
    let preImage = $('#new-pre-image').val();
    let uri = $('#new-pre-image-uri').val();
    let hash = createKeccakHash('keccak256').update(preImage).digest('hex');
    console.log("adding the following challenge:"+preImage+" with uri:"+uri+" eith hash:"+hash);
    tokenClaimInstance.addCollectible(hash,uri,{account:owner, gas: GAS });
  });

  $('#polePosition').click(()=>{
    getPolePosition();
  });