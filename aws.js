const AWS = require("aws-sdk");
AWS.config = new AWS.Config();
AWS.config.accessKeyId = "defaultKeyId";
AWS.config.secretAccessKey = "defaultAccesKey";
export const s3 = new AWS.S3();

if (AWS.config.accessKeyId == "defaultKeyId") throw "Please set AWS key ID";
if (AWS.config.secretAccessKey == "defaultAccesKey")
  throw "Please set AWS secret access key";
