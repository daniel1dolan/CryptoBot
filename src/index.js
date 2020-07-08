// Imports/reguires
require("dotenv").config();
const CoinbasePro = require("coinbase-pro");
const key = process.env.GDAX_KEY;
const secret = process.env.GDAX_SECRET;
const phrase = process.env.GDAX_PASSPHRASE;
const sandboxURL = "https://api-public.sandbox.pro.coinbase.com";

//Methods to buy and sell that needs client passed in and order details
const { placeBuy, placeSell } = require("./trades/placeOrder");

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
const publicClient = new CoinbasePro.PublicClient();

const callback = (error, response, data) => {
  if (error) {
    return console.dir(error);
  }
  return console.dir(data);
};

// historical rates are: 5 minute windows
async function historicalRates() {
  const results = await publicClient.getProductHistoricRates("BTC-USD", {
    granularity: 300,
  });
  console.log(results);
  // [timeStamp, low, high, open, close, volume]
}
historicalRates();

// placeSell(params, authenticatedClient);

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
