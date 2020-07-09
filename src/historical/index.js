const CoinbasePro = require("coinbase-pro");
const Candlestick = require("../models/candlestick");

function timeOut(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class HistoricalService {
  constructor({ start, end, product, interval = 300 }) {
    this.client = new CoinbasePro.PublicClient();
    this.start = start;
    this.end = end;
    this.product = product;
    this.interval = interval;
  }
  async getData() {
    const intervals = this.createRequests();
    const results = await this.performIntervals(intervals);
    const timestamps = {};
    const filtered = results.filter((x) => {
      const timestamp = x[0];
      const str = `${timestamp}`;
      if (timestamps[str] !== undefined) {
        return false;
      }
      timestamps[str] = true;
      return true;
    });
    const candlesticks = filtered.map((x) => {
      return new Candlestick({
        startTime: new Date(x[0] * 1e3),
        low: x[1],
        high: x[2],
        open: x[3],
        close: x[4],
        interval: this.interval,
        volume: x[5],
      });
    });
    return candlesticks;

    // console.log(filtered.length);
    // const results = await this.client.getProductHistoricRates(this.product, {
    //   start: this.start,
    //   end: this.end,
    //   granularity: this.interval,
    // });
    // return results;
  }
  async performIntervals(intervals) {
    if (intervals.length == 0) {
      return [];
    }
    const interval = intervals[0];

    const result = await this.performRequest(interval).then((r) => r.reverse());

    await timeOut(1 / 3);

    const next = await this.performIntervals(intervals.slice(1));
    return result.concat(next);
  }
  async performRequest({ start, end }) {
    const results = await this.client.getProductHistoricRates(this.product, {
      start,
      end,
      granularity: this.interval,
    });
    return results;
  }
  createRequests() {
    const max = 300;
    const delta = (this.end.getTime() - this.start.getTime()) * 1e-3;
    const numberIntervals = delta / this.interval;
    const numberRequests = Math.ceil(numberIntervals / 300);

    const intervals = Array(numberRequests)
      .fill()
      .map((_, reqNum) => {
        const size = this.interval * 300 * 1e3;
        const start = new Date(this.start.getTime() + reqNum * size);
        const end =
          reqNum + 1 === numberRequests
            ? this.end
            : new Date(start.getTime() + size);
        return { start, end };
      });
    return intervals;
  }
}

// Find where to get the -s date 1,593,982,635 3 days in the past. Point in video: 46 minutes or so.
// date +%s gives date in number format

module.exports = HistoricalService;
