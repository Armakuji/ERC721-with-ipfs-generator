const fs = require("fs");
const ipfsClient = require("ipfs-http-client");

const imageDir =  "./images"
const ipfsImageDir = "./ipfs-data/images"

async function generateIPFSImage(client) {
  let fileContents = []
  fs.readdir(imageDir, async function (err, files) {
    for (const [index, fileName] of files.entries()) {
      const fileContent = fs.readFileSync(`./images/${fileName}`);
      fileContents.push({path:`/tmp/${index + 1}`, content: fileContent})

    }

    for await (const result of client.addAll(fileContents)) {
        const cid = result.cid.toString();
        const parsedPath = result.path.split('/')[1]
        const path = parsedPath ? parsedPath : result.path
        fs.writeFileSync(`./ipfs-data/images/${path}.json`, JSON.stringify({cid}));

        if(parsedPath){
          console.log(`CID of Image ${path} : ${cid}`)
        }else{
          console.log(`CID of TMP folder : ${cid}` )
        }
      
    }
  });
}

async function uploadMetadataToIPFS(client) {

  fs.readdir(ipfsImageDir, async function (err, files) {

  })
}

async function main() {
  const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  await generateIPFSImage(client)
  // await uploadMetadataToIPFS(client)

  // process.exit(0)
}

main();
