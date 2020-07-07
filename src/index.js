require("dotenv").config();

const CoinbasePro = require("coinbase-pro");

const key = process.env.GDAX_KEY;

const secret = process.env.GDAX_SECRET;

const phrase = process.env.GDAX_PASSPHRASE;

const sandboxURL = "https://api-public.sandbox.pro.coinbase.com";

const accountIDs = {
  BTC: "c09ae1db-40e9-46df-bf26-762f051f2bb5",
  ETH: "bd641cbf-71c8-44ee-a79a-727a52c4d00c",
};

const authenticatedClient = new CoinbasePro.AuthenticatedClient(
  key,
  secret,
  phrase,
  sandboxURL
);

const params = {
  price: 9769.66,
  size: 1,
};

const { placeBuy, placeSell } = require("./trades/placeOrder");

placeSell(params, authenticatedClient);

// authenticatedClient.getAccount(accountIDs.BTC, (error, response, data) => {
//   if (error) {
//     console.dir(error);
//   }
//   return console.dir(data);
// });

// const websocket = require("./currentPrices/getBitcoin");

// authenticatedClient.getAccounts((error, response, data) => {
//   if (error) {
//     console.dir(error);
//   }
//   return console.dir(data);
// });
