const CoinbasePro = require("coinbase-pro");

exports.placeBuy = (buyData, authedClient) => {
  const buyParams = {
    price: buyData.price,
    size: buyData.size,
    product_id: "BTC-USD",
  };
  this.buyOrderId = authedClient.buy(buyParams, (error, response, data) => {
    if (error) {
      return console.dir(error);
    }
    return console.dir(data);
  });
};

exports.placeSell = (sellData, authedClient) => {
  const sellParams = {
    price: sellData.price,
    size: sellData.size,
    product_id: "BTC-USD",
  };
  this.sellOrderId = authedClient.sell(sellParams, (error, response, data) => {
    if (error) {
      return console.dir(error);
    }
    return console.dir(data);
  });
};
