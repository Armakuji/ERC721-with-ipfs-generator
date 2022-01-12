const MintNFT = artifacts.require("MintNFT");

const fs = require('fs')
const path = require('path')


const FILE_DATA = fs.readFileSync(path.resolve(__dirname, '../assets/ipfs-data/metadata/tmp.json'))
const IPFS_METADATA = JSON.parse(FILE_DATA)
const URI = IPFS_METADATA.URI

module.exports = async function (deployer) {
    deployer.deploy(MintNFT, 'MintNFT', 'MNFT', URI);
}