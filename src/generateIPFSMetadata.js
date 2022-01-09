const { promises: fs } = require("fs");
const ipfsClient = require("ipfs-http-client");
const imageDir = "./images";
const metadataDir = "./metadata";
const ipfsImageDir = "./ipfs-data/images";
const ipfsMetadataDir = "./ipfs-data/metadata";

const addIPFSPrefix = (cid) => {
  return `https://ipfs.io/ipfs/${cid}`;
};


const generateIPFSImage = async (client, description) => {
  console.log("Start generate IPFS Image......")
  try {
      const fileNames = await fs.readdir(imageDir)

      //generage image IPFS
      for (const [index, fileName] of fileNames.entries()) {
        const fileContent = await fs.readFile(`${imageDir}/${fileName}`);
        const result = await client.add(fileContent);
        const cid = result.cid.toString();
        const imageName = index + 1;
        const imageURI = addIPFSPrefix(cid);

        //write image to ipfs json file
        await fs.writeFile(
          `${ipfsImageDir}/${imageName}.json`,
          JSON.stringify({ URI: imageURI }, null, 2)
        );

        //write raw metadata to json file
        const metadata = {
          name: imageName,
          description: description,
          image: imageURI,
        };

        await fs.writeFile(
          `${metadataDir}/${index + 1}.json`,
          JSON.stringify(metadata, null, 2)
        );
      }
  } catch (error) {
    return console.log(`error : `, error);
  }
};

const generateIPFSMetadata = async (client) => {
  console.log("Start generate IPFS Metadata......")
  const fileNames = await fs.readdir(metadataDir)
  let fileContents = [];

  try {
      //prepare all medata file contents
      for (const [index, fileName] of fileNames.entries()) {
        const fileContent = await fs.readFile(`./${metadataDir}/${fileName}`);
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
        await fs.writeFile(
          `${ipfsMetadataDir}/${path}.json`,
          JSON.stringify({ URI })
        );
      }
      console.log("Done ✨✨✨")
  } catch (error) {
    return console.log(`error : `, error);
  }
}

async function startGenerate() {
  const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  const description = "Generate IPFS of metadata tools";

  await generateIPFSImage(client, description)
  await generateIPFSMetadata(client);
  
}

startGenerate();
