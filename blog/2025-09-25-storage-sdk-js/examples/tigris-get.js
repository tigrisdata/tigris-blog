import { get } from '@tigrisdata/storage';

const { data, error } = get("object.txt", "string");

if (error !== undefined) {
  // or whatever else you do in your project
  throw error;
}

console.log(data);