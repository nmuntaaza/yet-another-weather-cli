import fs from 'fs';

export async function version() {
  fs.readFile('./package.json', (err, data) => {
    if (err) throw err;
    console.log(JSON.parse(data).version);
  })
}