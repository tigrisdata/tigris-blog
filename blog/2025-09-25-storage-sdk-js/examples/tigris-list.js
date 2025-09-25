import { list } from "@tigrisdata/storage";

const { data, error } =
  await list({ limit: 100 });

if (error !== undefined) {
  console.error("Error listing files:", error);
}

data.forEach(({ name, size }) => {
  console.log(`${name}: ${size} bytes`);
});
