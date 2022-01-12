const { promises: fs } = require("fs");


const ipfsClient = require("ipfs-http-client");
const imageDir = "./assets/images";
const metadataDir = "./assets/metadata";

const addIPFSPrefix = (cid) => {
  return `https://ipfs.io/ipfs/${cid}/`;
};

async function startGenerate() {
  const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  const description = "Generate IPFS of metadata tools";

  console.log("Start generate IPFS Image......");
  try {
    const fileNames = await fs.readdir(imageDir);

    //generage image IPFS
    for (const [index, fileName] of fileNames.entries()) {
      const fileContent = await fs.readFile(`${imageDir}/${fileName}`);
      const result = await client.add(fileContent);
      const cid = result.cid.toString();
      const imageName = index;
      const imageURI = addIPFSPrefix(cid);

      //write raw metadata to json file
      const metadata = {
        name: imageName,
        description: description,
        image: imageURI,
      };

      console.log(`write raw metadata : ${imageName}`);
      await fs.writeFile(
        `${metadataDir}/${index}.json`,
        JSON.stringify(metadata, null, 2)
      );
    }
    console.log("Done ✨✨✨")
  } catch (error) {
    return console.log(`error : `, error);
  }
}

startGenerate();
