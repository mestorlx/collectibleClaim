Web3 = require('web3')
import getContractInstance from "./app/getContractInstance"
import {s3} from './aws';
const createKeccakHash = require('keccak')
import { showError, GAS, web3, notOwner, owner, userAccount} from './app/constants';
import {tableHeading, tableTail, tableRow} from './app/polePositionTable';
var request = require('request');

const baseURL = 'http://s3.amazonaws.com/zeppelin.itam/'
const imageFolder = 'img/'
const baseUrlImg = 'http://s3.amazonaws.com/zeppelin.itam/'+imageFolder
const imageExtension = '.png'
let defaultIMG = 'default.png'
let someHash = "0xf2d0..............................021109921169c";
var myBucket = 'zeppelin.itam';
let tokenClaimInstance;
let leTokenInstance;

async function setup(){
    let instances = await getContractInstance();
    tokenClaimInstance = instances[1];
    leTokenInstance = instances[0];    
    setComponentsVisibility();
}

function createURI(preImage){
    let hash = createKeccakHash('keccak256').update(preImage).digest('hex');
    const js = {
        name: hash,
        description: preImage,
        image: baseUrlImg+hash+imageExtension
      };
    let uri = baseURL+hash+'.json';
    let file = hash+'.json';
    s3.putObject({ACL: 'public-read', Bucket: myBucket,Key:file,Body: JSON.stringify(js), ContentType: "application/json"},function(err,data){
        console.log("Error:");
        console.log(JSON.stringify(err)+" "+JSON.stringify(data))
        ;}
    );
    checkAndCreateCollectibleImage(hash);
}

/// Wait until page is loaded before getting instances.
window.addEventListener('load', function() {
    console.log("Page loaded");
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.log('MetaMask is running');
    } else {
      console.log('MetaMask is not running');
    }
    // setup contract instances
    setup();
});

async function getPolePosition(){
    let pending = await tokenClaimInstance.collectiblesPendingToClaim();
    let claimed = await leTokenInstance.totalSupply();
    console.log("Collectibles pending to claim:"+pending.valueOf()+" collectibles claimed:"+claimed);
    $('#pole-position-results').html("");
    let table = tableHeading;
    table+='<tr><td align="center" colspan="3">"Collectibles pending to claim"</td></tr>';
    for(var i = 0; i < pending.valueOf();i++){
        table+=tableRow('<img height="64" width="64" src="'+defaultIMG+'" alt=""></img>',someHash,"Not claimed yet");
    }
    table+='<tr><td align="center" colspan="3">"Collectibles claimed"</td></tr>';
    table+=tableTail;
    $('#pole-position-results').append(table);
    for(var i = 0; i < claimed.valueOf();i++){
        let uri = await leTokenInstance.tokenURI(i);
        console.log("will fetch the following collectible uri:"+uri);
        request({url:uri},function (error, response, body) {
            //     console.log('error:', error); 
            //     console.log('statusCode:', response && response.statusCode); 
            //     console.log("le body:", body);
                let j = JSON.parse(body);
                var row = document.createElement('tr');
                var col = document.createElement('td');
                var col2 = document.createElement('td');
                var col3 = document.createElement('td');
                row.appendChild(col); 
                row.appendChild(col2);
                row.appendChild(col3);
                console.log('Using the following image');
                console.log(j['image']);
                col.innerHTML = '<img height="64" width="64" src="'+j['image']+'" alt=""></img>'
                col2.innerHTML = j['name'];
                col3.innerHTML = j['description']; 
                var table = document.getElementById("pole-position"); 
                table.appendChild(row);
            });   
    }
};

async function claimCollectible(to, preImage) {
    // We compare the collectible supply to verify if the actual collectible 
    // was minted. 
    let supply = await leTokenInstance.totalSupply();
    let hash = createKeccakHash('keccak256').update(preImage).digest('hex');
    let claim = { preImage: preImage, hash: hash };
    console.log(`Claiming ${JSON.stringify(claim)}`);
    let uri = baseURL+hash+'.json';
    await tokenClaimInstance.claimCollectible(to,preImage,uri,{gas:GAS}); 
    let newSupply = await leTokenInstance.totalSupply();
    let tokenResult;
    if(newSupply.valueOf() > supply.valueOf()){
        createURI(preImage);
        tokenResult = "<h3>YAY!<h3>";
    }
    else{
        tokenResult = " <h3>You suck!</h3>";
    }
    $('#claim-result').html("");
    $('#claim-result').append(tokenResult);
}

function checkAndCreateCollectibleImage(hash){
    var params = {
        Bucket: myBucket,
        Key: imageFolder+hash+imageExtension
    };
    console.log('Checking if image exist');
    s3.headObject(params, function (err, metadata) {  
        if (err && err.code === 'NotFound') {  
          console.log('Image not found creating from default')
            params = {
                Bucket: myBucket,
                CopySource: myBucket+'/'+imageFolder+defaultIMG,
                Key: imageFolder+hash+imageExtension
            };
            s3.copyObject(params, function(err, data) {
                if (err) {
                    console.log("Error while copying image");
                    console.log(err);
            } else {
                console.log("Image created successfully");
            }
            });
        } else {  
            console.log('Image present')
        }
      });
}

$('#claim-token').click(() => {
    $('#claim-result').html("");
    let preImage = $('#pre-image').val();
    let to = notOwner;
    var tokenResult = "";
    if(preImage){
        claimCollectible(to, preImage);
    }
    else{
        tokenResult = " <h3>Enter pre-image</h3>";
        $('#claim-result').html("");
        $('#claim-result').append(tokenResult);
    }
  });

  $('#add-token').click(()=>{
    let owner = tokenClaimInstance.owner();
    let preImage = $('#new-pre-image').val();
    if(preImage){
        console.log("adding the following challenge:"+preImage);
        tokenClaimInstance.addCollectible(preImage,{account:owner, gas: GAS });
    }
  });

  $('#polePosition').click(()=>{
    getPolePosition();
  });

  function setComponentsVisibility(){
      if(userAccount == owner){
          console.log("its owner. Show add collectible menu");
          var h = document.getElementById("add-collectible-header");
          h.style.display = "block";
          var l = document.getElementById("pre-image");
          l.style.display = "block";
          var i = document.getElementById("new-pre-image");
          i.style.display = "block";
          var b = document.getElementById("add-token");
          b.style.display = "block";
      }

  }