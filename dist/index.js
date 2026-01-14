"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const { Gasless } = require("@nucastio/gasless");
try {
    const gaslessPool = new Gasless({
        mode: "pool",
        wallet: {
            network: 0,
            key: {
                type: "mnemonic",
                words: process.env.mnemonic
            },
        },
        conditions: {
            tokenRequirements: [
                { unit: "lovelace", quantity: 1000000, comparison: "gte" },
            ],
        },
        apiKey: process.env.BLOCKFROST_API_KEY || "",
    });
    gaslessPool.listen(5050);
    console.log("✅ Pool server started on port 5050");
}
catch (e) {
    console.error("Error:", e);
}
// Initialize a sponsor client
function SponsorClient() {
    if (!process.env.BLOCKFROST_API_KEY) {
        console.log("BLOCKFROST_API_KEY is missing !!");
        return;
    }
    const gaslessSponsor = new Gasless({
        mode: "sponsor",
        apiKey: process.env.BLOCKFROST_API_KEY,
    });
    // Sponsor a transaction
    async function sponsorTransaction() {
        const txCbor = process.env.txCbor; // Replace with actual CBOR
        // const poolAddress = ""; // Replace with actual pool address
        const sponsoredTx = await gaslessSponsor.sponsorTx({
            txCbor,
            poolId: process.env.WalletAddr,
        });
        // Validate and sign the transaction
        const validatedTx = await gaslessSponsor.validateTx({
            txCbor: sponsoredTx,
            poolSignServer: "http://localhost:5050",
        });
        console.log("Validated Transaction CBOR:", validatedTx);
    }
    sponsorTransaction().catch(console.error);
}
SponsorClient();
