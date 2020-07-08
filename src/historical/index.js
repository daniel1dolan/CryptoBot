const CoinbasePro = require("coinbase-pro");
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
    console.log(intervals);
    const results = await this.client.getProductHistoricRates(this.product, {
      start: this.start,
      end: this.end,
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
          reqNum + 1 === numberRequest
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
