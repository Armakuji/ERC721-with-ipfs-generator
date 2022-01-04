async function main() {
    const client = ipfsClient.create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });
  
    // await uploadImagesToIPFS(client)
    // await uploadMetadataToIPFS(client)
  
    // process.exit(0)
  }
  
  main();