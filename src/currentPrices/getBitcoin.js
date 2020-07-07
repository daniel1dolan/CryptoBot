const CoinbasePro = require("coinbase-pro");

const BTC_USD = "BTC-USD";

const websocket = new CoinbasePro.WebsocketClient([BTC_USD]);

const websocketCallback = (data) => {
  if (!(data.type === "done" && data.reason === "filled")) {
    return;
  }
  console.dir(data);
};
websocket.on("message", websocketCallback);

module.exports = websocket;
