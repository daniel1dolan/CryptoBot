const CoinbasePro = require("coinbase-pro");

class Ticker {
  constructor({ product, onTick, onError }) {
    this.product = product;
    this.onTick = onTick;
    this.onError = onError;
    this.running = false;
  }
  start() {
    this.running = true;
    this.client = new CoinbasePro.WebsocketClient(
      [this.product],
      "wss://ws-feed.pro.coinbase.com",
      null,
      { channels: ["ticker", "heartbeat"] }
    );
    this.client.on("message", async (data) => {
      if (data.type === "ticker") {
        await this.onTick(data);
      }
    });
    this.client.on("error", (err) => {
      this.onError(err);
      this.client.connect();
    });
    this.client.on("close", () => {
      if (this.running) {
        this.client.connect();
      }
    });
  }
  stop() {
    this.running = false;
    this.client.close();
  }
}

module.exports = module = Ticker;
