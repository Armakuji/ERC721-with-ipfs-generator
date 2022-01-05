const fs = require("fs");
const ipfsClient = require("ipfs-http-client");

const imageDir =  "./images"
const ipfsImageDir = "./ipfs-data/images"

const addIPFSPrefix = (cid) => {
  return `https://ipfs.io/ipfs/${cid}`;
};

const generateIPFSImageAndMetadata = async (client, description) => {
  fs.readdir(imageDir, async function (err, files) {

    //upload image to IPFS and get CID
    for (const [index, fileName] of files.entries()) {
      const fileContent = fs.readFileSync(`./images/${fileName}`);
      const result = await client.add(fileContent);
      const cid = result.cid.toString();
      const imageName = index + 1
      const imageURI = addIPFSPrefix(cid);
      console.log(`Image URI of ${imageName} : ${imageURI}`);

      //generate image IPFS
      fs.writeFileSync(
        `./ipfs-data/images/${imageName}.json`,
        JSON.stringify({ URI: imageURI }, null, 1)
      );

      //generate metadata
      const metadata = {
        name: imageName,
        description: description,
        image: imageURI
      }

      fs.writeFileSync(
        `./ipfs-data/metadata/${index + 1}.json`,
        JSON.stringify(metadata, null, 3)
      );
 
    }
  });
}


async function generateIPFSMetadata(client) {
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
        await fs.writeFileSync(`./ipfs-data/images/${path}.json`, JSON.stringify({cid}));

        if(parsedPath){
          console.log(`CID of Image ${path} : ${cid}`)
        }else{
          console.log(`CID of TMP folder : ${cid}` )
        }
      
    }
  });
}

async function main() {
  const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  const description = "Generate IPFS of metadata tools"

  await generateIPFSImageAndMetadata(client, description)
  // await generateIPFSMetadata(client)
}

main();
