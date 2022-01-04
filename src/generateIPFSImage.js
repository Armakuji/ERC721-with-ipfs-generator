const fs = require("fs");
const ipfsClient = require("ipfs-http-client");

const imageDir =  "./images"

const addIPFSPrefix = (cid) => {
    return `https://ipfs.io/ipfs/${cid}`
}

export async function generateIPFSImage(client) {
  fs.readdir(imageDir, async function (err, files) {
    for (const [index, fileName] of files.entries()) {
      const fileContent = fs.readFileSync(`./images/${fileName}`);
      const result = await client.add(fileContent)
      const cid = result.cid.toString();
      const parsedCid = addIPFSPrefix(cid)
      fs.writeFileSync(`./ipfs-data/images/${index+1}.json`, JSON.stringify({URI: parsedCid}));
      console.log(`CID of Image ${index+1} : ${parsedCid}`)
    }
  });
}

async function main() {
  const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  await generateIPFSImage(client)
}

main();
