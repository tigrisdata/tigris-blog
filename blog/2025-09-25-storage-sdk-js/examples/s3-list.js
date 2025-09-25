import {
  S3Client,
  ListObjectsV2Command
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1"
});

const command = new ListObjectsV2Command({
  Bucket: "my-bucket",
  MaxKeys: 100,
});
const response = await s3Client.send(command);

response.Contents.forEach((item) => {
  console.log(`${item.Key}: ${item.Size} bytes`);
});
