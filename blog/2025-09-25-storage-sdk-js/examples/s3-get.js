import {
  S3Client,
  GetObjectCommand
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-east-1" });

const command = new GetObjectCommand({
  Bucket: "my-bucket",
  Key: "object.txt",
});
const response = await s3Client.send(command);
const data = response.Body.transformToString("utf-8");

console.log(data);