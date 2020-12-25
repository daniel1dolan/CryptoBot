const Strategy = require("./strategy");
const tulind = require("tulind");

class SimpleMACD extends Strategy {
  async run({ sticks, time }) {
    const prices = sticks.map((stick) => stick.average());

    const shortPeriod = 12;
    const longPeriod = 26;
    const signalPeriod = 9;
    const emaPeriod = 200;
    const indicator = tulind.indicators.macd.indicator;
    const emaIndicator = tulind.indicators.ema.indicator;

    const results = await indicator(
      [prices],
      [shortPeriod, longPeriod, signalPeriod]
    );
    const emaRes = await emaIndicator([prices], [emaPeriod]);

    const histogram = results[2];
    const signal = results[1];
    const macd = results[0];
    const ema = emaRes[0];

    const length = signal.length;
    const emaLength = ema.length;
    if (length < 2) {
      return;
    }
    const penultimateSignal = signal[length - 2];
    const lastSignal = signal[length - 1];
    const penultimateMACD = macd[length - 2];
    const lastMACD = macd[length - 1];
    const lastEMA = ema[emaLength - 1];

    const boundary = 0;

    const signalBelowZero = lastSignal < boundary;
    const wasAbove = penultimateMACD > penultimateSignal;
    const wasBelow = penultimateMACD < penultimateSignal;
    const isAbove = lastMACD > lastSignal;
    const isBelow = lastMACD < lastSignal;

    const open = this.openPositions();

    const price = sticks[sticks.length - 1].close;

    const priceAboveEMA = price > lastEMA;

    if (open.length === 0) {
      const buySignal = signalBelowZero && priceAboveEMA && wasBelow && isAbove;
      // Buying strategy logic.
      if (buySignal) {
        this.onBuySignal({ price, time });
      }
    } else {
      open.forEach((p) => {
        const metProfitGoal = p.enter.price * 1.02 <= price;
        const metStopLoss = p.enter.price * 0.99 >= price;
        const signOfDip = wasAbove && isBelow;
        // Selling strategy logic.
        // 1. Sell if price is up 2%.
        if (metProfitGoal) {
          console.log("normal sell", p.enter.price, price);
          this.onSellSignal({ price, time, size: p.enter.size, position: p });
        }
        // 2. Sell if price was above and is now below, and gained 2%.
        else if (signOfDip && metProfitGoal) {
          console.log("was above and is now below", p.enter.price, price);
          console.log("nested sell", p.enter.price, price);
          this.onSellSignal({ price, time, size: p.enter.size, position: p });
        }
        // Stop loss logic.
        // 1. Sell if price is down 1%.
        else {
          if (metStopLoss) {
            console.log("stop loss", p.enter.price, price);
            this.onSellSignal({ price, time, size: p.enter.size, position: p });
          }
        }
      });
    }
  }
}

module.exports = SimpleMACD;
