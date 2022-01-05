const fs = require("fs");
const ipfsClient = require("ipfs-http-client");

const imageDir = "./images";
const metadataDir = "./metadata";
const ipfsImageDir = "./ipfs-data/images";
const ipfsMetadataDir = "./ipfs-data/metadata";

const addIPFSPrefix = (cid) => {
  return `https://ipfs.io/ipfs/${cid}`;
};

const generateIPFSImageAndMetadata = async (client, description) => {
  console.log("Start generate IPFS Image......")
  try {
    await fs.readdir(imageDir, async function (err, files) {
      //generage image IPFS
      for (const [index, fileName] of files.entries()) {
        const fileContent = fs.readFileSync(`${imageDir}/${fileName}`);
        const result = await client.add(fileContent);
        const cid = result.cid.toString();
        const imageName = index + 1;
        const imageURI = addIPFSPrefix(cid);
        console.log(`URI of Image ${imageName} : ${imageURI}`);

        //write image to ipfs json file
        fs.writeFileSync(
          `${ipfsImageDir}/${imageName}.json`,
          JSON.stringify({ URI: imageURI }, null, 1)
        );

        //write metadata to json file
        const metadata = {
          name: imageName,
          description: description,
          image: imageURI,
        };

        fs.writeFileSync(
          `${metadataDir}/${index + 1}.json`,
          JSON.stringify(metadata, null, 3)
        );
      }
    });

    Promise.resolve()
  } catch (error) {
    return console.log(`error : `, error);
  }
};

async function generateIPFSMetadata(client) {
  console.log("Start generate IPFS Metadata......")
  let fileContents = [];

  try {
    await fs.readdir(metadataDir, async function (err, files) {
      //prepare all medata file contents
      for (const [index, fileName] of files.entries()) {
        const fileContent = fs.readFileSync(`./${metadataDir}/${fileName}`);
        fileContents.push({ path: `/tmp/${index + 1}`, content: fileContent });
      }

      // generate IPFS root URI with addAll()
      for await (const result of client.addAll(fileContents)) {
        const URI = result.cid.toString();
        const parsedRootPath = result.path.split("/")[1];
        const path = parsedRootPath ? parsedRootPath : result.path;

        if (parsedRootPath) {
          console.log(`URI of Metadata ${path} : ${URI}`);
        } else {
          console.log(`URI of TMP folder : ${URI}`);
        }

       //write IPFS metadata to json file
        await fs.writeFileSync(
          `${ipfsMetadataDir}/${path}.json`,
          JSON.stringify({ URI })
        );
      }
    });
    Promise.resolve()
  } catch (error) {
    return console.log(`error : `, error);
  }
}

async function main() {
  const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  const description = "Generate IPFS of metadata tools";

  await generateIPFSImageAndMetadata(client, description)
  await generateIPFSMetadata(client);
  
}

main();
