# ERC721-with-ipfs-generator

## Getting Started

This repo have code for generating metadata and can host images and metadata on `IPFS`

It comes with an ERC721 contract that was created with `OpenZeppelin`. is used to generate NFT and has a `mint payable` function to buy NFT.

And you can verify the contract with `truffle-plugin-verify`.

### Clone project

```
$ git clone https://github.com/Armakuji/ERC721-with-ipfs-generator.git
```

### Installation

Install npm dependencies

```
$ npm install
```

##  Usage of Metadata Generating Tools

#### 1.  You have to put your images in the `assets/images` folder.

#### 2. Generate Raw Metadata by using this command.

```
$ npm run generate_raw_metadata
```

* you will see your raw metadata in the `assets/metadata` folder and You can add your image `triats` there.

#### 3. Generate IPFS Metadata by using this command.

```
$ npm run generate_ipfs_metadata
```
* you will see your `URI of IPFS metadata` in the `assets/ipfs-data/metadata` folders.

##  Usage of ERC721 NFT sale contracts

#### 1.  You must have `MNEMONIC`, `INFURA_KEY` and `ETHERSCAN_API_KEY` in your `.env` file first.

#### 2.  Deploy Smart Contract.

```
$ truffle migrate –network rinkeby
```

#### 3.  Verify Smart Contract.

```
$ truffle run verify MintNFT --network rinkeby
```
