import {
  S3Client,
  PutObjectCommand
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-east-1" });

const data = await s3Client.send(
  new PutObjectCommand({
    Bucket: "your-bucket-name",
    Key: "object.txt",
    Body: "hello world",
    ContentType: "text/plain",
  })
);
