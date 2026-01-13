const  { Lucid, Blockfrost } = require( "lucid-cardano");



async function  Create() {
    

const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    process.env.BLOCKFROST_API_KEY!
  ),
  "Preprod"
);

// Wallet is user's wallet (Nami, Lace, etc.)
lucid.selectWalletFromSeed("user mnemonic words");

// Build TX
const tx = await lucid
  .newTx()
  .payToAddress(
    "addr_test1...", // receiver
    { lovelace: 2_000_000n }
  )
  .complete();

// 🔥 IMPORTANT: unsigned CBOR
const txCbor = tx.toString(); // CBOR hex

console.log(txCbor)

}

Create()
