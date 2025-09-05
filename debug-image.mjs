import sizeOf from "image-size";
import fs from "fs";

const imagePath = "/workspaces/tigris-blog/blog/2025-08-07-qwen-image/ty-vs-ty.webp";

console.log("File exists:", fs.existsSync(imagePath));

try {
  const buffer = fs.readFileSync(imagePath);
  console.log("Buffer length:", buffer.length);

  const dimensions = sizeOf(buffer);
  console.log("Dimensions:", dimensions);
} catch (error) {
  console.error("Error:", error.message);
}
