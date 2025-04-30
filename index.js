
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
require('dotenv').config();
console.log("RPC_URL:", process.env.RPC_URL); // Debug line

const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('<RPC_URL>');



const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve your index.html from "public" folder

// Setup provider and funder wallet (ensure only one declaration of provider)
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const funder = new ethers.Wallet(process.env.FUNDER_PRIVATE_KEY, provider); // Create funder wallet with provider

app.post('/send-eth', async (req, res) => {
  const { to } = req.body;
  try {
    const tx = await funder.sendTransaction({
      to,
      value: ethers.utils.parseEther("0.00015"),
    });
    await tx.wait();
    console.log(`Sent 0.00001 ETH to ${to}`);
    res.status(200).send({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error('ETH send failed:', err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.post('/log-wallet', (req, res) => {
  const { wallet } = req.body;
  fs.appendFile('wallet.txt', wallet + '\n', (err) => {
    if (err) {
      console.error('Failed to log wallet:', err);
      res.status(500).send({ success: false });
    } else {
      console.log(`Logged wallet: ${wallet}`);
      res.send({ success: true });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
