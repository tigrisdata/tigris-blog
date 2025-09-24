import { list } from '@tigrisdata/storage';

const { data, error } = await list({ limit: 100 });

if (error !== undefined) {
  console.error('Error listing files:', error);
}

data.forEach(file => {
  console.log(`${file.name}: ${file.size} bytes`)
});