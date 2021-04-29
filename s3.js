require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStream = getFileStream;
