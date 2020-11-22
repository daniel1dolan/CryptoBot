const Candlestick = require("../models/candlestick");
const Historical = require("../historical");
const Runner = require("../runner");
const { Factory } = require("../strategies");
const randomstring = require("randomstring");
const colors = require("colors");

/**
 * BackTester runs a strategy and returns the result of the positions.
 */
class Backtester extends Runner {
  async start() {
    try {
      const history = await this.historical.getData();
      await Promise.all(
        history.map(async (stick, index) => {
          const sticks = history.slice(0, index + 1);
          await this.strategy.run({
            sticks,
            time: stick.startTime,
          });
        })
      );
      const positions = this.strategy.getPositions();
      positions.forEach((p) => {
        p.print();
      });
      const total = positions.reduce((r, p) => {
        return r + p.profit();
      }, 0);

      const wonTrades = positions.filter((p) => p.profit() > 0);
      const winPercentage = (wonTrades.length / positions.length) * 100;
      const percent = `${winPercentage.toFixed(2)}%`;
      const coloredPercent =
        winPercentage > 50 ? colors.green(percent) : colors.red(percent);

      const prof = `${total}`;
      const colored = total > 0 ? colors.green(prof) : colors.red(prof);

      console.log(`Total: ${colored}`);
      console.log(`Win Ratio: ${coloredPercent}`);
    } catch (error) {
      console.log(error);
    }
  }
  async onBuySignal({ price, time }) {
    const id = randomstring.generate(20);
    this.strategy.positionOpened({
      price,
      time,
      size: 1.0,
      id,
    });
  }
  async onSellSignal({ price, size, time, position }) {
    this.strategy.positionClosed({
      price,
      time,
      size,
      id: position.id,
    });
  }
}

module.exports = Backtester;
