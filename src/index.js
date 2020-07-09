// Imports/reguires
const program = require("commander");
const Historical = require("./historical/index");
const BackTester = require("./backtesting");
require("dotenv").config();
const CoinbasePro = require("coinbase-pro");
const key = process.env.GDAX_KEY;
const secret = process.env.GDAX_SECRET;
const phrase = process.env.GDAX_PASSPHRASE;
const sandboxURL = "https://api-public.sandbox.pro.coinbase.com";

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1e3);

function toDate(val) {
  return new Date(val * 1e3);
}

// creates a command line program with certain flags that can be sent which changes
// how the scripts run
program
  .version("1.0.0")
  .option(
    "-i, --interval [interval]",
    "Interval in seconds for candlestick",
    parseInt
  )
  .option("-p, --product [product]", "Product Identifier", "BTC-USD")
  .option(
    "-s, --start [start]",
    "Start Time in Unix Seconds",
    toDate,
    yesterday
  )
  .option("-e, --end [end]", "End time in unix seconds", toDate, now)
  .parse(process.argv);

const main = async function () {
  const { interval, product, start, end } = program;

  const tester = new BackTester({
    start,
    end,
    product,
    interval,
  });

  // service will run a grab of historical data and plug in inputs from program or defaults
  const service = new Historical({
    start,
    end,
    product,
    interval,
  });

  console.log(tester);

  await tester.start();

  //   const data = await service.getData();

  //   console.log(data);
};

main();
////
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
// [timeStamp, low, high, open, close, volume]
// async function historicalRates() {
//   const results = await publicClient.getProductHistoricRates("BTC-USD", {
//     granularity: 300,
//   });
// granularity of 300 is 5 minutes intervals or 5 * 60
//   console.log(results);
// }
// historicalRates();

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
