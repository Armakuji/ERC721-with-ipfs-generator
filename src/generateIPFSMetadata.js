const { promises: fs } = require("fs");
const ipfsClient = require("ipfs-http-client");
const metadataDir = "./assets/metadata";
const ipfsMetadataDir = "./assets/ipfs-data/metadata";

const addIPFSPrefix = (cid) => {
  return `https://ipfs.io/ipfs/${cid}/`;
};

async function startGenerate() {
  const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });


  const fileNames = await fs.readdir(metadataDir)
  let fileContents = [];

  if(fileNames.length === 0){
    return console.log('No raw metadata. Please make raw metadata first.')
  }

  console.log("Start generate IPFS Metadata......")
  
  try {
    
      //prepare all medata file contents
      for (const [index, fileName] of fileNames.entries()) {
        const fileContent = await fs.readFile(`./${metadataDir}/${fileName}`);
        fileContents.push({ path: `/tmp/${index}`, content: fileContent });
      }


      // generate IPFS root URI with addAll()
      for await (const result of client.addAll(fileContents)) {
        const URI = result.cid.toString();
        const parsedRootPath = result.path.split("/")[1];
        const path = parsedRootPath ? parsedRootPath : result.path;
        const metadataURI = addIPFSPrefix(URI);

        if (parsedRootPath) {
          console.log(`URI of Metadata ${path} : ${metadataURI}`);
        } else {
          console.log(`URI of TMP folder : ${metadataURI}`);
        }

       //write IPFS metadata to json file
        await fs.writeFile(
          `${ipfsMetadataDir}/${path}.json`,
          JSON.stringify({ URI:metadataURI })
        );
      }
      console.log("Done ✨✨✨")
  } catch (error) {
    return console.log(`error : `, error);
  }
  
}

startGenerate();
